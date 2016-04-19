package at.reisisoft.jku.pjdke.sqlanalyzer;

import java.sql.Timestamp;
import java.util.Objects;

/**
 * Created by Florian on 18.03.2016.
 */
public class LogElement {
    private String type;
    private long id;
    private Timestamp timestamp;

    public LogElement(String type, long id, Timestamp timestamp) {
        Objects.requireNonNull(type);
        Objects.requireNonNull(timestamp);
        if (id < 0) throw new IllegalArgumentException("ID < 0");
        this.type = type;
        this.id = id;
        this.timestamp = timestamp;
    }

    public String getType() {
        return type;
    }

    public long getId() {
        return id;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LogElement)) return false;

        LogElement that = (LogElement) o;

        if (getId() != that.getId()) return false;
        if (!getType().equals(that.getType())) return false;
        return getTimestamp().equals(that.getTimestamp());

    }

    @Override
    public int hashCode() {
        int result = getType().hashCode();
        result = 31 * result + (int) (getId() ^ (getId() >>> 32));
        result = 31 * result + getTimestamp().hashCode();
        return result;
    }

    @Override
    public String toString() {
        return type;
    }
}
