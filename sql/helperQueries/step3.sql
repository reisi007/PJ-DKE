CREATE TABLE routeInfo (
  bestellNr BIGINT UNSIGNED,
  hash      TEXT,
  ihash     INTEGER,
  INDEX (ihash)
);