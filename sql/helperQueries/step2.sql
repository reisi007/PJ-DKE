CREATE TABLE log AS
  SELECT *
  FROM (SELECT
          h.id                    AS 'bestellnr',
          b.krednr                AS 'kreditorId',
          'Bestellmenge geändert' AS 'type',
          h.aenderts              AS 'when'
        FROM Änderungshistorie h JOIN bestellung b ON h.id = b.bestellnr) bg
  UNION (SELECT
           pos.bestellnr,
           b.krednr                   AS 'kreditorId',
           'Bestellposition erstellt' AS 'type',
           pos.erstelltTs             AS 'when'
         FROM bestellpos pos JOIN bestellung b ON pos.bestellnr = b.bestellnr)
  UNION (SELECT
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
           JOIN bestellung b ON bp.bestellnr = b.bestellnr)
  UNION (SELECT
           bestellnr,
           krednr                AS 'kreditorId',
           'Bestellung erstellt' AS 'type',
           erstelltTs            AS 'when'
         FROM bestellung)
  UNION (SELECT
           bestellnr,
           krednr                   AS 'kreditorId',
           'Bestellung freigegeben' AS 'type',
           freigabets               AS 'when'
         FROM bestellung)
  UNION (SELECT
           c.kredNr            AS 'kreditorId',
           b.bestellnr,
           'Kreditor erstellt' AS 'type',
           c.erstellt          AS 'when'
         FROM creditor c JOIN bestellung b ON c.kredNr = b.krednr)
  UNION (SELECT
           a.*,
           b.bestellnr
         FROM (SELECT
                 id                  AS 'kreditorId',
                 aenderts            AS 'when',
                 'Kreditor gesperrt' AS 'type'
               FROM Änderungshistorie
               WHERE tabelle = 'Kreditor' AND wertNeu = 'X') a JOIN bestellung b ON a.kreditorId = b.krednr)
  UNION (SELECT
           b.bestellnr,
           b.krednr         AS 'kreditorId',
           'Preis geändert' AS 'type',
           `when`
         FROM (SELECT
                 id,
                 aenderts AS 'when'
               FROM Änderungshistorie
               WHERE tabelle = 'Bestellposition' AND feld = 'Preis') a JOIN (SELECT
                                                                               bestellnr,
                                                                               concat(posnr, bestellnr) AS 'joinId'
                                                                             FROM bestellpos) bp ON a.id = bp.joinId
           JOIN bestellung b ON b.bestellnr = bp.bestellnr)