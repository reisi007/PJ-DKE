package at.reisisoft.jku.pjdke.sqlanalyzer;

import at.reisisoft.jku.pjdke.sqlimporter.Import;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by Florian on 18.03.2016.
 */
public class Analyze {
    public static void main(String[] args) throws Exception {
        Class.forName("com.mysql.jdbc.Driver");
        log("Getting data");
        final Connection connection = DriverManager.getConnection(Import.JDBC_CONNECTION_STRING);
        connection.setAutoCommit(false);
        final Statement statement = connection.createStatement();
        final ResultSet resultSet = statement.executeQuery("SELECT * FROM log");
        final Map<Long, Set<LogElement>> traces = new HashMap<>();
        long bestellnr;
        final Comparator<LogElement> logElementComparator = (e1, e2) -> {
            int res = e1.getTimestamp().compareTo(e2.getTimestamp());
            if (res != 0)
                return res;
            return e1.getType().compareTo(e2.getType());
        };
        String type;
        Timestamp timestamp;
        while (resultSet.next()) {
            bestellnr = resultSet.getLong("bestellnr");
            type = resultSet.getString("type");
            timestamp = resultSet.getTimestamp("when");
            traces.computeIfAbsent(bestellnr, e -> new TreeSet<>(logElementComparator)).add(new LogElement(type, bestellnr, timestamp));
        }
        log(traces.size() + " verschiendene Bestellungen!");
        Map<Long, String> bestellNrHashCodeSet = traces.entrySet().parallelStream().collect(Collectors.toMap(Map.Entry::getKey, kvp -> kvp.getValue().toString()));
        //In Tabelle schreiben
        final Path dir = Paths.get("").toAbsolutePath().getParent().resolve("helperQueries");
        final Statement statement2 = connection.createStatement();
        statement2.execute("DROP TABLE IF EXISTS routeInfo");
        statement2.execute(loadSqlfile(dir.resolve("step3.sql")));
        //Insert in route info
        final PreparedStatement pstmt = connection.prepareStatement("INSERT INTO  routeInfo(bestellnr,hash,ihash) VALUES (?,?,?)");
        for (Map.Entry<Long, String> kvp : bestellNrHashCodeSet.entrySet()) {
            pstmt.setLong(1, kvp.getKey());
            pstmt.setString(2, kvp.getValue());
            pstmt.setInt(3, kvp.getValue().hashCode());
            pstmt.addBatch();
        }
        pstmt.executeBatch();
        //Select unique paths
        statement2.execute("DROP TABLE IF EXISTS uniquePaths");
        statement2.execute("CREATE TABLE  uniquePaths AS SELECT @n := @n + 1 n,  ihash FROM (SELECT ihash FROM routeinfo GROUP BY ihash ORDER BY count(ihash) DESC) ri, (SELECT @n := 0)m");
        statement2.execute("DROP TABLE IF EXISTS routeStat");
        statement2.execute("DROP TABLE IF EXISTS naccRouteStats");
        statement2.execute(loadSqlfile(dir.resolve("step3d.sql")));
        statement2.execute(loadSqlfile(dir.resolve("step3e.sql")));
        log("Create flow");
        String step3bSql = IOUtils.toString(Files.newBufferedReader(dir.resolve("step3b.sql")));
        statement2.execute("DROP TABLE IF EXISTS flow");
        statement2.execute(step3bSql);
        //                                                                          1       2     3     4   5     6     7
        PreparedStatement pstmt2 = connection.prepareStatement("INSERT INTO flow(bestellnr,prev,tsPrev,cur,tsCur,next,tsNext) VALUES (?,?,?,?,?,?,?)");
        for (Long key : traces.keySet()) {
            ArrayList<LogElement> value = new ArrayList<>(traces.get(key));
            //First element
            pstmt2.setLong(1, key);
            pstmt2.setString(2, null);
            pstmt2.setTimestamp(3, null);
            pstmt2.setString(4, value.get(0).getType());
            pstmt2.setTimestamp(5, value.get(0).getTimestamp());
            if (value.size() == 1) {
                pstmt2.setString(6, null);
                pstmt2.setTimestamp(7, null);
                pstmt2.execute();
            } else {
                pstmt2.setString(6, value.get(1).getType());
                pstmt2.setTimestamp(7, value.get(1).getTimestamp());
                pstmt2.addBatch();
                //Last element
                LogElement last = value.get(value.size() - 1), prev = value.get(value.size() - 2);
                pstmt2.setLong(1, key);
                pstmt2.setString(2, prev.getType());
                pstmt2.setTimestamp(3, prev.getTimestamp());
                pstmt2.setString(4, last.getType());
                pstmt2.setTimestamp(5, last.getTimestamp());
                pstmt2.setString(6, null);
                pstmt2.setTimestamp(7, null);
                pstmt2.addBatch();
            }
            //Elements in the middle
            for (int i = 1; i < value.size() - 1; i++) {
                LogElement prev = value.get(i - 1), cur = value.get(i), next = value.get(i + 1);
                pstmt2.setLong(1, key);
                pstmt2.setString(2, prev.getType());
                pstmt2.setTimestamp(3, prev.getTimestamp());
                pstmt2.setString(4, cur.getType());
                pstmt2.setTimestamp(5, cur.getTimestamp());
                pstmt2.setString(6, next.getType());
                pstmt2.setTimestamp(7, next.getTimestamp());
                pstmt2.addBatch();
            }
            pstmt2.executeBatch();
        }
        log("Prepare table GraphData");
        statement2.execute("DROP TABLE IF EXISTS graphData");
        statement2.execute(loadSqlfile(dir.resolve("step3c.sql")));
        log("Done analyzing!");
        connection.commit();
        connection.close();
    }

    private static void log(Object o) {
        System.out.println(o);
    }

    private static String loadSqlfile(Path p) throws IOException {
        return IOUtils.toString(Files.newBufferedReader(p));
    }
}
