CREATE TABLE routeInfo (
  id    BIGINT UNSIGNED,
  hash  TEXT,
  ihash INTEGER,
  INDEX (ihash)
);