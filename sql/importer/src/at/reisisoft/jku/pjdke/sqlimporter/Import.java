package at.reisisoft.jku.pjdke.sqlimporter;

import at.reisisoft.jku.pjdke.sqlanalyzer.Analyze;
import org.apache.commons.io.IOUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.*;
import java.util.stream.Collectors;

public class Import {

    private static final String ÄNDERUNGSHISTORIE = "änderungshistorie";
    private static final String BESTELLUNG = "bestellung";
    private static final String BESTELLPOS = "bestellpos";
    private static final String KREDITOR = "creditor";
    private static final String RECHNUNG = "rechnung";
    private static final String WARENEINGANG = "wareneingang";
    private static final String ZAHLUNG = "zahlung";

    //Check password
    public static final String JDBC_CONNECTION_STRING = "jdbc:mysql://localhost/pjdke?user=root&password=1234&useSSL=false";

    public static void main(String[] args) throws Exception {
        log("Loading CSV");
        final Path dir = Paths.get("").toAbsolutePath();
        final String[] filenames = {ÄNDERUNGSHISTORIE, BESTELLPOS, BESTELLUNG, KREDITOR, RECHNUNG, WARENEINGANG, ZAHLUNG};
        final Path p = dir.getParent().resolve("csv");
        Class.forName("com.mysql.jdbc.Driver");
        Map<String, List<String[]>> fileContent = Arrays.stream(filenames).parallel().map(filename -> {
            try (BufferedReader in = Files.newBufferedReader(p.resolve(filename + ".csv"))) {
                List<String[]> values = new ArrayList<>();
                String line;
                while ((line = in.readLine()) != null) values.add(line.split(","));
                return new AbstractMap.SimpleEntry<>(filename, values);
            } catch (IOException e) {
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toMap(AbstractMap.SimpleEntry::getKey, AbstractMap.SimpleEntry::getValue));
        Connection con = DriverManager.getConnection(JDBC_CONNECTION_STRING);
        con.setAutoCommit(false);
        log("Init db");
        Path create = dir.getParent().resolve("create").resolve("create.sql");
        log("Get connection");
        try (Statement s = con.createStatement()) {
            for (String table : filenames) {
                s.execute("truncate " + table);
            }
        }
        List<String[]> rows = null;
        log("Filling Änderungshistorie");
        PreparedStatement preparedStatement = con.prepareStatement("INSERT INTO änderungshistorie VALUES (?,?,?,?,?,?,?,?)");
        rows = fileContent.get(ÄNDERUNGSHISTORIE);
        for (String[] line : rows) {
            for (int i = 0; i < line.length; i++) {
                preparedStatement.setString(i + 1, line[i]);
            }
            preparedStatement.addBatch();
        }
        preparedStatement.executeBatch();
        preparedStatement.close();
        log("Filling bestellpos");
        preparedStatement = con.prepareStatement("INSERT INTO bestellpos VALUES (?,?,?,?,?,?,?,?,?,?)");
        rows = fileContent.get(BESTELLPOS);
        for (String[] line : rows) {
            for (int i = 0; i < line.length; i++) {
                switch (i) {
                    case 7:
                        preparedStatement.setBoolean(8, "x".equals(line[7]));
                        break;
                    default:
                        preparedStatement.setString(i + 1, line[i]);
                        break;
                }
            }
            preparedStatement.addBatch();
        }
        preparedStatement.executeBatch();
        preparedStatement.close();
        log("Filling bestellung");
        preparedStatement = con.prepareStatement("INSERT INTO bestellung VALUES (?,?,?,?,?,?,?)");
        rows = fileContent.get(BESTELLUNG);
        for (String[] line : rows) {
            for (int i = 0; i < line.length; i++) {
                switch (i) {
                    case 2:
                        preparedStatement.setBoolean(i + 1, !line[i].isEmpty());
                        break;
                    default:
                        preparedStatement.setString(i + 1, line[i]);
                        break;
                }
            }
            preparedStatement.addBatch();
        }
        preparedStatement.executeBatch();
        preparedStatement.close();
        log("Filling creditor");
        preparedStatement = con.prepareStatement("INSERT INTO creditor VALUES (?,?,?,?,?,?,?,?,?,?)");
        rows = fileContent.get(KREDITOR);
        for (String[] line : rows) {
            for (int i = 0; i < line.length; i++) {
                switch (i) {
                    case 0:
                        int offset = Character.isDigit(line[i].charAt(0)) ? 0 : 1;
                        preparedStatement.setLong(i + 1, Long.parseLong(line[i].substring(offset)));
                        break;
                    case 7:
                        preparedStatement.setBoolean(i + 1, !line[i].isEmpty());
                        break;
                    default:
                        preparedStatement.setString(i + 1, line[i]);
                        break;
                }
            }
            preparedStatement.addBatch();
        }
        preparedStatement.executeBatch();
        preparedStatement.close();
        log("Filling rechnung");
        preparedStatement = con.prepareStatement("INSERT INTO rechnung VALUES (?,?,?,?,?,?,?,?)");
        rows = fileContent.get(RECHNUNG);
        for (String[] line : rows) {
            for (int i = 0; i < line.length; i++) {
                switch (i) {
                    default:
                        String tmp = line[i];
                        if (tmp.isEmpty()) {
                            tmp = null;
                        }
                        preparedStatement.setString(i + 1, tmp);
                        break;
                }
            }
            preparedStatement.addBatch();
        }
        preparedStatement.executeBatch();
        preparedStatement.close();
        log("Filling wareneingang");
        preparedStatement = con.prepareStatement("INSERT INTO wareneingang VALUES (?,?,?,?,?,?,?,?)");
        rows = fileContent.get(WARENEINGANG);
        for (String[] line : rows) {
            for (int i = 0; i < line.length; i++) {
                String tmp = line[i];
                if (tmp.isEmpty()) {
                    tmp = null;
                }
                preparedStatement.setString(i + 1, tmp);

            }
            preparedStatement.addBatch();
        }
        preparedStatement.executeBatch();
        preparedStatement.close();
        log("Filling zahlung");
        preparedStatement = con.prepareStatement("INSERT INTO zahlung VALUES (?,?,?,?,?,?,?)");
        rows = fileContent.get(ZAHLUNG);
        for (String[] line : rows) {
            for (int i = 0; i < line.length; i++) {
                String tmp = line[i];
                if (tmp.isEmpty()) {
                    tmp = null;
                }
                preparedStatement.setString(i + 1, tmp);

            }
            preparedStatement.addBatch();
        }
        preparedStatement.executeBatch();
        preparedStatement.close();
        log("Create log");
        Path pStep2Sql = dir.resolve("../helperQueries/step2.sql");
        String step2Sql = IOUtils.toString(Files.newBufferedReader(pStep2Sql));
        Statement statement = con.createStatement();
        statement.execute("DROP TABLE IF EXISTS log");
        statement.execute(step2Sql);
        con.commit();
        log("Done syncing");
        Analyze.main(args);
    }

    private static void log(Object o) {
        System.out.println(o);
    }
}
