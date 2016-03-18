--Bestellmenge geändert
SELECT
  h.id                    AS 'bestellnr',
  b.krednr                AS 'kreditorId',
  'Bestellmenge geändert' AS 'type',
  h.aenderts              AS 'when'
FROM Änderungshistorie h JOIN bestellung b ON h.id = b.bestellnr
--Bestellposition erstellt
SELECT
  pos.bestellnr,
  b.krednr                   AS 'kreditorId',
  pos.erstelltTs             AS 'when',
  'Bestellposition erstellt' AS 'type'
FROM bestellpos pos JOIN bestellung b ON pos.bestellnr = b.bestellnr;
--Bestellposition storniert
SELECT
  b.bestellnr,
  b.krednr AS 'kreditorId',
  a.type,
  a.`when`
FROM (SELECT
        id,
        'Bestellposition storniert' AS 'type',
        aenderts                    AS 'when'
      FROM Änderungshistorie
      WHERE tabelle = 'Bestellposition' AND feld = 'StornoKZ') a JOIN (SELECT
                                                                         bestellnr,
                                                                         concat(posnr, bestellnr) AS 'joinId'
                                                                       FROM bestellpos) bp ON a.id = bp.joinId
  JOIN bestellung b ON bp.bestellnr = b.bestellnr;
--Bestellung erstellt
SELECT
  bestellnr,
  krednr                AS 'kreditorId',
  erstelltTs            AS 'when',
  'Bestellung erstellt' AS 'type'
FROM bestellung
--Bestellung freigegeben
SELECT
  bestellnr,
   krednr                AS 'kreditorId',
  freigabets               AS 'when',
  'Bestellung freigegeben' AS 'type'
FROM bestellung
--Kreditor erstellt
SELECT
  c.kredNr            AS 'kreditorId',
  b.bestellnr,
  'Kreditor erstellt' AS 'type',
  c.erstellt          AS 'when'
FROM creditor c JOIN bestellung b ON c.kredNr = b.krednr;
--Kreditor gesperrt
SELECT
  a.*,
  b.bestellnr
FROM (SELECT
        id                  AS 'kreditorId',
		 aenderts            AS 'when',
        'Kreditor gesperrt' AS 'type'
      FROM Änderungshistorie
      WHERE tabelle = 'Kreditor' AND wertNeu = 'X') a JOIN bestellung b ON a.kreditorId = b.krednr;
--Preis geändert
SELECT
  b.bestellnr,
  b.krednr         AS 'kreditorId',
  `when`,
  'Preis geändert' AS 'type'
FROM (SELECT
        id,
        aenderts AS 'when'
      FROM Änderungshistorie
      WHERE tabelle = 'Bestellposition' AND feld = 'Preis') a JOIN (SELECT
                                                                      bestellnr,
                                                                      concat(posnr, bestellnr) AS 'joinId'
                                                                    FROM bestellpos) bp ON a.id = bp.joinId
  JOIN bestellung b ON b.bestellnr = bp.bestellnr;
  