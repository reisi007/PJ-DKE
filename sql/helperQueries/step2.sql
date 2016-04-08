CREATE TABLE log AS SELECT *
                    FROM (SELECT *
                          FROM (SELECT
                                  b.bestellnr,
                                  'Bestellmenge geändert' AS 'type',
                                  h.aenderts              AS 'when'
                                FROM Änderungshistorie h
                                  JOIN bestellung b ON h.id = b.bestellnr) bg
                          UNION (SELECT
                                   pos.bestellnr,
                                   'Bestellposition erstellt' AS 'type',
                                   pos.erstelltTs             AS 'when'
                                 FROM bestellpos pos
                                   JOIN bestellung b ON pos.bestellnr = b.bestellnr)
                          UNION (SELECT
                                   b.bestellnr,
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
                                           concat(posnr, bestellnr) AS 'joinId'
                                         FROM bestellpos) bp ON a.id = bp.joinId
                                   JOIN bestellung b ON bp.bestellnr = b.bestellnr)
                          UNION (SELECT
                                   bestellnr,
                                   'Bestellung erstellt' AS 'type',
                                   erstelltTs            AS 'when'
                                 FROM bestellung)
                          UNION (SELECT
                                   bestellnr,
                                   'Bestellung freigegeben' AS 'type',
                                   freigabets               AS 'when'
                                 FROM bestellung)
                          UNION (SELECT
                                   b.bestellnr,
                                   'Kreditor erstellt' AS 'type',
                                   c.erstellt          AS 'when'
                                 FROM creditor c
                                   JOIN bestellung b ON c.kredNr = b.krednr)
                          UNION (SELECT
                                   b.bestellnr,
                                   a.type,
                                   a.`when`
                                 FROM (SELECT
                                         id                  AS 'kreditorId',
                                         'Kreditor gesperrt' AS 'type',
                                         aenderts            AS 'when'
                                       FROM Änderungshistorie
                                       WHERE tabelle = 'Kreditor' AND wertNeu = 'X') a
                                   JOIN bestellung b ON a.kreditorId = b.krednr)
                          UNION (SELECT
                                   b.bestellnr,
                                   'Preis geändert' AS 'type',
                                   `when`
                                 FROM (SELECT
                                         id,
                                         aenderts AS 'when'
                                       FROM Änderungshistorie
                                       WHERE tabelle = 'Bestellposition' AND feld = 'Preis') a
                                   JOIN (SELECT
                                           bestellnr,
                                           concat(posnr, bestellnr) AS 'joinId'
                                         FROM bestellpos) bp ON a.id = bp.joinId
                                   JOIN bestellung b ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   bestellnr,
                                   'Rechnung eingegangen' AS 'type',
                                   eingangsdatum          AS 'when'
                                 FROM rechnung)
                          UNION (SELECT
                                   bestellnr,
                                   'Rechnung gestellt' AS 'type',
                                   rechnungsdatum      AS 'when'
                                 FROM rechnung)
                          UNION (SELECT
                                   bestellnr,
                                   'Ware eingegangen' AS 'type',
                                   eingangsts         AS 'when'
                                 FROM wareneingang)
                          UNION (SELECT
                                   bp.bestellnr           AS 'bestellnr',
                                   'Zahlung durchgeführt' AS 'type',
                                   zahlts                 AS 'when'
                                 FROM zahlung z
                                   JOIN (SELECT
                                           bestellnr,
                                           concat(posnr, bestellnr) AS 'joinId'
                                         FROM bestellpos) bp ON bp.joinId = z.id)) total
                    WHERE !isnull(total.bestellnr)
                    UNION SELECT
                            b.bestellnr,
                            'Kreditor entsperrt' AS 'type',
                            aenderts             AS 'when'
                          FROM (SELECT
                                  id,
                                  aenderts
                                FROM änderungshistorie
                                WHERE tabelle = 'Kreditor' AND wertAlt = '' AND änderungshistorie.wertNeu = 'X') d
                            JOIN bestellung b ON d.id = b.krednr
                    UNION SELECT
                            id                     AS 'bestellnr',
                            'Bestellung storniert' AS 'type',
                            aenderts               AS 'when'
                          FROM änderungshistorie
                          WHERE tabelle = 'Bestellung' AND feld = 'StornoKZ';