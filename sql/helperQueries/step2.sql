CREATE TABLE log AS SELECT *
                    FROM (SELECT *
                          FROM (SELECT
                                  concat(b.bestellnr, b.posnr) AS 'bestellnr',
                                  'Bestellmenge geändert'      AS 'type',
                                  h.aenderts                   AS 'when'
                                FROM Änderungshistorie h
                                  JOIN bestellpos b ON h.id = b.bestellnr) bg
                          UNION (SELECT
                                   concat(pos.bestellnr, pos.posnr) AS 'bestellnr',
                                   'Bestellposition erstellt'       AS 'type',
                                   pos.erstelltTs                   AS 'when'
                                 FROM bestellpos pos
                                   JOIN bestellung b ON pos.bestellnr = b.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   a.type,
                                   a.`when`
                                 FROM (SELECT
                                         id,
                                         'Bestellposition storniert' AS 'type',
                                         aenderts                    AS 'when'
                                       FROM Änderungshistorie
                                       WHERE tabelle = 'Bestellposition' AND feld = 'StornoKZ') a
                                   JOIN (SELECT
                                           bestellnr,
                                           posnr,
                                           concat(posnr, bestellnr) AS 'joinId'
                                         FROM bestellpos) bp ON a.id = bp.joinId
                                   JOIN bestellung b ON bp.bestellnr = b.bestellnr)
                          UNION (SELECT
                                   concat(b.bestellnr, posnr) AS 'bestellnr',
                                   'Bestellung erstellt'      AS 'type',
                                   bp.erstelltTs              AS 'when'
                                 FROM bestellung b
                                   JOIN bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(b.bestellnr, posnr) AS 'bestellnr',
                                   'Bestellung freigegeben'   AS 'type',
                                   freigabets                 AS 'when'
                                 FROM bestellung b
                                   JOIN bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   'Kreditor erstellt'            AS 'type',
                                   c.erstellt                     AS 'when'
                                 FROM creditor c
                                   JOIN bestellung b ON c.kredNr = b.krednr
                                   JOIN bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   a.type,
                                   a.`when`
                                 FROM (SELECT
                                         id                  AS 'kreditorId',
                                         'Kreditor gesperrt' AS 'type',
                                         aenderts            AS 'when'
                                       FROM Änderungshistorie
                                       WHERE tabelle = 'Kreditor' AND wertNeu = 'X') a
                                   JOIN bestellung b ON a.kreditorId = b.krednr
                                   JOIN bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   'Preis geändert'               AS 'type',
                                   `when`
                                 FROM (SELECT
                                         id,
                                         aenderts AS 'when'
                                       FROM Änderungshistorie
                                       WHERE tabelle = 'Bestellposition' AND feld = 'Preis') a
                                   JOIN (SELECT
                                           bestellnr,
                                           posnr,
                                           concat(posnr, bestellnr) AS 'joinId'
                                         FROM bestellpos) bp ON a.id = bp.joinId
                                   JOIN bestellung b ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   'Rechnung eingegangen'         AS 'type',
                                   eingangsdatum                  AS 'when'
                                 FROM rechnung r
                                   JOIN bestellpos bp ON r.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   'Rechnung gestellt'            AS 'type',
                                   rechnungsdatum                 AS 'when'
                                 FROM rechnung r
                                   JOIN bestellpos bp ON r.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   'Ware eingegangen'             AS 'type',
                                   eingangsts                     AS 'when'
                                 FROM wareneingang w
                                   JOIN bestellpos bp ON w.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   'Zahlung durchgeführt'         AS 'type',
                                   zahlts                         AS 'when'
                                 FROM zahlung z
                                   JOIN (SELECT
                                           bestellnr,
                                           posnr,
                                           concat(posnr, bestellnr) AS 'joinId'
                                         FROM bestellpos) bp ON bp.joinId = z.id)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   'Kreditor entsperrt'           AS 'type',
                                   aenderts                       AS 'when'
                                 FROM (SELECT
                                         id,
                                         aenderts
                                       FROM änderungshistorie
                                       WHERE
                                         tabelle = 'Kreditor' AND wertAlt = '' AND änderungshistorie.wertNeu = 'X') d
                                   JOIN bestellung b ON d.id = b.krednr
                                   JOIN bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'bestellnr',
                                   a.type,
                                   a.`when`
                                 FROM (SELECT
                                         id                     AS 'bestellnr',
                                         'Bestellung storniert' AS 'type',
                                         aenderts               AS 'when'
                                       FROM änderungshistorie
                                       WHERE tabelle = 'Bestellung' AND feld = 'StornoKZ') a
                                   JOIN bestellpos bp ON a.bestellnr = bp.bestellnr)) t