CREATE TABLE pjdke.änderungshistorie
(
  aendernr  INT UNSIGNED PRIMARY KEY,
  tabelle   TEXT,
  feld      TEXT,
  id        BIGINT UNSIGNED,
  wertNeu   TEXT,
  wertAlt   TEXT,
  aenderts  TIMESTAMP,
  aenderusr VARCHAR(16)
);
CREATE TABLE pjdke.bestellpos
(
  posnr         INT UNSIGNED,
  bestellnr     BIGINT UNSIGNED,
  materialnr    BIGINT UNSIGNED,
  menge         INT UNSIGNED,
  mengeneinheit VARCHAR(2),
  preis         DOUBLE,
  währung       VARCHAR(3),
  stornokz      BOOLEAN,
  erstelltTs    TIMESTAMP,
  erstellusr    VARCHAR(16),
  CONSTRAINT bestellpos_posnr_bestellnr_pk PRIMARY KEY (posnr, bestellnr)
);
CREATE TABLE pjdke.creditor
(
  kredNr    BIGINT UNSIGNED PRIMARY KEY,
  vname     TEXT,
  nname     TEXT,
  firma     TEXT,
  plz       INT UNSIGNED,
  ort       TEXT,
  land      VARCHAR(2),
  SperrKZ   BOOLEAN,
  erstellus VARCHAR(16),
  erstellt  TIMESTAMP
);
CREATE TABLE pjdke.rechnung
(
  rechnungsnr    BIGINT UNSIGNED PRIMARY KEY,
  positionsnr    INT UNSIGNED,
  bestellnr      INT UNSIGNED,
  eingangsdatum  TIMESTAMP,
  rechnungsdatum DATE,
  betrag         DOUBLE,
  währung        VARCHAR(3),
  kreditnr       BIGINT UNSIGNED
);
CREATE TABLE pjdke.bestellung
(
  bestellnr   BIGINT UNSIGNED PRIMARY KEY,
  krednr      BIGINT UNSIGNED,
  stornokz    BOOLEAN,
  erstelltTs  TIMESTAMP,
  erstellusr  VARCHAR(16),
  freigabets  TIMESTAMP,
  freigabeusr VARCHAR(16)
);
CREATE TABLE pjdke.wareneingang
(
  id            BIGINT UNSIGNED PRIMARY KEY,
  posnr         INT UNSIGNED,
  bestellnr     BIGINT UNSIGNED,
  menge         INT UNSIGNED,
  mengeneinheit VARCHAR(2),
  eingangsts    TIMESTAMP,
  eingangsurs   VARCHAR(16),
  krednr        BIGINT UNSIGNED
);
CREATE TABLE pjdke.zahlung
(
  id          BIGINT UNSIGNED PRIMARY KEY,
  rechnungsnr BIGINT UNSIGNED,
  betrag      DOUBLE,
  währung     VARCHAR(3),
  zahlts      TIMESTAMP,
  zahlusr     VARCHAR(16),
  kreditornr  BIGINT UNSIGNED
);
COMMIT;