package at.reisisoft.jku.pjdke.sqlanalyzer;

import at.reisisoft.jku.pjdke.sqlimporter.Import;
import org.apache.commons.io.IOUtils;

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
        final Comparator<LogElement> logElementComparator = (e1, e2) -> e1.getTimestamp().compareTo(e2.getTimestamp());
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
        Path step3SqlFile = dir.resolve("step3.sql");
        String step3sql = IOUtils.toString(Files.newBufferedReader(step3SqlFile));
        final Statement statement2 = connection.createStatement();
        statement2.execute("DROP TABLE IF EXISTS routeInfo");
        statement2.execute(step3sql);
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
        statement2.execute("CREATE TABLE  uniquePaths AS SELECT @n := @n + 1 n,  ihash FROM (SELECT ihash FROM routeinfo GROUP BY ihash) ri, (SELECT @n := 0)m");
        log("Done analyzing!");
        connection.commit();
        connection.close();
    }

    private static void log(Object o) {
        System.out.println(o);
    }

   /* private static String getIDFromType(String type) {
        switch (type) {
            case "Bestellmenge geändert":
                return "BMG";
            case "Bestellposition erstellt":
                return "BPG";
            case "Bestellposition storniert":
                return "BPS";
            case "Bestellung erstellt":
            default:
                throw new IllegalArgumentException("Unsupported: " + type);
        }

}*/
}
