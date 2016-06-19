CREATE DATABASE IF NOT EXISTS pjdke;
CREATE TABLE IF NOT EXISTS pjdke.änderungshistorie
(
  aendernr  INT UNSIGNED PRIMARY KEY,
  tabelle   TEXT,
  feld      TEXT,
  id        BIGINT UNSIGNED,
  wertNeu   TEXT,
  wertAlt   TEXT,
  aenderts  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aenderusr VARCHAR(16)
);
CREATE TABLE IF NOT EXISTS pjdke.bestellpos
(
  posnr         INT UNSIGNED,
  bestellnr     BIGINT UNSIGNED,
  materialnr    BIGINT UNSIGNED,
  menge         INT UNSIGNED,
  mengeneinheit VARCHAR(2),
  preis         DOUBLE,
  währung       VARCHAR(3),
  stornokz      BOOLEAN,
  erstelltTs    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  erstellusr    VARCHAR(16),
  CONSTRAINT bestellpos_posnr_bestellnr_pk PRIMARY KEY (posnr, bestellnr)
);
CREATE TABLE IF NOT EXISTS pjdke.creditor
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
  erstellt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS pjdke.rechnung
(
  rechnungsnr    BIGINT UNSIGNED PRIMARY KEY,
  positionsnr    INT UNSIGNED,
  bestellnr      INT UNSIGNED,
  eingangsdatum  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rechnungsdatum DATE,
  betrag         DOUBLE,
  währung        VARCHAR(3),
  kreditnr       BIGINT UNSIGNED
);
CREATE TABLE IF NOT EXISTS pjdke.bestellung
(
  bestellnr   BIGINT UNSIGNED PRIMARY KEY,
  krednr      BIGINT UNSIGNED,
  stornokz    BOOLEAN,
  erstelltTs  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  erstellusr  VARCHAR(16),
  freigabets  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  freigabeusr VARCHAR(16)
);
CREATE TABLE IF NOT EXISTS pjdke.wareneingang
(
  id            BIGINT UNSIGNED PRIMARY KEY,
  posnr         INT UNSIGNED,
  bestellnr     BIGINT UNSIGNED,
  menge         INT UNSIGNED,
  mengeneinheit VARCHAR(2),
  eingangsts    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  eingangsurs   VARCHAR(16),
  krednr        BIGINT UNSIGNED
);
CREATE TABLE IF NOT EXISTS pjdke.zahlung
(
  id          BIGINT UNSIGNED PRIMARY KEY,
  rechnungsnr BIGINT UNSIGNED,
  betrag      DOUBLE,
  währung     VARCHAR(3),
  zahlts      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  zahlusr     VARCHAR(16),
  kreditornr  BIGINT UNSIGNED
);
COMMIT;