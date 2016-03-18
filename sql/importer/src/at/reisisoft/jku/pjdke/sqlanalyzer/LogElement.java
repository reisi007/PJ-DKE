package at.reisisoft.jku.pjdke.sqlanalyzer;

import java.sql.Timestamp;
import java.util.Objects;

/**
 * Created by Florian on 18.03.2016.
 */
public class LogElement {
    private String type;
    private long bestellNr;
    private Timestamp timestamp;

    public LogElement(String type, long bestellNr, Timestamp timestamp) {
        Objects.requireNonNull(type);
        Objects.requireNonNull(timestamp);
        if (bestellNr < 0) throw new IllegalArgumentException("BestellNr > 0");
        this.type = type;
        this.bestellNr = bestellNr;
        this.timestamp = timestamp;
    }

    public String getType() {
        return type;
    }

    public long getBestellNr() {
        return bestellNr;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LogElement)) return false;

        LogElement that = (LogElement) o;

        if (getBestellNr() != that.getBestellNr()) return false;
        if (!getType().equals(that.getType())) return false;
        return getTimestamp().equals(that.getTimestamp());

    }

    @Override
    public int hashCode() {
        int result = getType().hashCode();
        result = 31 * result + (int) (getBestellNr() ^ (getBestellNr() >>> 32));
        result = 31 * result + getTimestamp().hashCode();
        return result;
    }

    @Override
    public String toString() {
        return type;
    }
}
