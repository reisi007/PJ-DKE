CREATE TABLE pjdke.flow
(
  bestellnr INTEGER UNSIGNED NOT NULL,
  prev      VARCHAR(255),
  cur       VARCHAR(255)     NOT NULL,
  next      VARCHAR(255),
  tsPrev    TIMESTAMP,
  tsCur     TIMESTAMP        NOT NULL,
  tsNext    TIMESTAMP
)