--Bestellmenge geändert
SELECT
  id                      AS 'bestellnr',
  'Bestellmenge geändert' AS 'type',
  aenderts                AS 'when'
FROM Änderungshistorie
--Bestellposition erstellt
SELECT
  bestellnr,
  erstelltTs                 AS 'when',
  'Bestellposition erstellt' AS 'type'
FROM bestellpos
ORDER BY bestellnr;
WHERE tabelle = 'Bestellposition' AND feld = 'Menge'
--Bestellposition storniert
SELECT
  id                          AS 'bestellnr',
  'Bestellposition storniert' AS 'type',
  aenderts                    AS 'when'
FROM Änderungshistorie
WHERE tabelle = 'Bestellposition' AND feld = 'StornoKZ'
--Bestellung erstellt
SELECT
  bestellnr,
  erstelltTs            AS 'when',
  'Bestellung erstellt' AS 'type'
FROM bestellung
--Bestellung freigegeben
SELECT
  bestellnr,
  freigabets               AS 'when',
  'Bestellung freigegeben' AS 'type'
FROM bestellung
--Kreditor erstellt
SELECT
  kredNr              AS 'kreditorId',
  'Kreditor erstellt' AS 'type',
  erstellt            AS 'when'
FROM creditor
--Kreditor gesperrt
SELECT
  id                  AS 'kreditorId',
  'Kreditor gesperrt' AS 'type',
  aenderts            AS 'when'
FROM Änderungshistorie
WHERE tabelle = 'Kreditor' AND wertNeu = 'X';
--Preis geändert
SELECT
  bestellnr,
  `when`,
  'Preis geändert' AS 'type'
FROM (SELECT
        id,
        aenderts AS 'when'
      FROM Änderungshistorie
      WHERE tabelle = 'Bestellposition' AND feld = 'Preis') a JOIN (SELECT
                                                                      bestellnr,
                                                                      concat(posnr, bestellnr) AS 'joinId'
                                                                    FROM bestellpos) b ON a.id = b.joinId;