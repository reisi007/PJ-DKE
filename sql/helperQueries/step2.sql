CREATE TABLE log AS SELECT *
                    FROM (SELECT *
                          FROM (SELECT
                                  concat(b.bestellnr, b.posnr) AS 'id',
                                  'Bestellmenge geändert'      AS 'type',
                                  h.aenderts                   AS 'when'
                                FROM änderungshistorie h
                                  JOIN pjdke.bestellpos b ON h.id = b.bestellnr) bg
                          UNION (SELECT
                                   concat(pos.bestellnr, pos.posnr) AS 'id',
                                   'Bestellposition erstellt'       AS 'type',
                                   pos.erstelltTs                   AS 'when'
                                 FROM pjdke.bestellpos pos
                                   JOIN pjdke.bestellung b ON pos.bestellnr = b.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   a.type,
                                   a.`when`
                                 FROM (SELECT
                                         id,
                                         'Bestellposition storniert' AS 'type',
                                         aenderts                    AS 'when'
                                       FROM pjdke.änderungshistorie
                                       WHERE tabelle = 'Bestellposition' AND feld = 'StornoKZ') a
                                   JOIN (SELECT
                                           bestellnr,
                                           posnr,
                                           concat(posnr, bestellnr) AS 'joinId'
                                         FROM pjdke.bestellpos) bp ON a.id = bp.joinId
                                   JOIN pjdke.bestellung b ON bp.bestellnr = b.bestellnr)
                          UNION (SELECT
                                   concat(b.bestellnr, posnr) AS 'id',
                                   'Bestellung erstellt'      AS 'type',
                                   bp.erstelltTs              AS 'when'
                                 FROM pjdke.bestellung b
                                   JOIN pjdke.bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(b.bestellnr, posnr) AS 'id',
                                   'Bestellung freigegeben'   AS 'type',
                                   freigabets                 AS 'when'
                                 FROM pjdke.bestellung b
                                   JOIN pjdke.bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   'Kreditor erstellt'            AS 'type',
                                   c.erstellt                     AS 'when'
                                 FROM creditor c
                                   JOIN pjdke.bestellung b ON c.kredNr = b.krednr
                                   JOIN pjdke.bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   a.type,
                                   a.`when`
                                 FROM (SELECT
                                         id                  AS 'kreditorId',
                                         'Kreditor gesperrt' AS 'type',
                                         aenderts            AS 'when'
                                       FROM pjdke.änderungshistorie
                                       WHERE tabelle = 'Kreditor' AND wertNeu = 'X') a
                                   JOIN pjdke.bestellung b ON a.kreditorId = b.krednr
                                   JOIN pjdke.bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   'Preis geändert'               AS 'type',
                                   `when`
                                 FROM (SELECT
                                         id,
                                         aenderts AS 'when'
                                       FROM pjdke.änderungshistorie
                                       WHERE tabelle = 'Bestellposition' AND feld = 'Preis') a
                                   JOIN (SELECT
                                           bestellnr,
                                           posnr,
                                           concat(posnr, bestellnr) AS 'joinId'
                                         FROM pjdke.bestellpos) bp ON a.id = bp.joinId
                                   JOIN pjdke.bestellung b ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   'Rechnung eingegangen'         AS 'type',
                                   eingangsdatum                  AS 'when'
                                 FROM pjdke.rechnung r
                                   JOIN pjdke.bestellpos bp ON r.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   'Rechnung gestellt'            AS 'type',
                                   rechnungsdatum                 AS 'when'
                                 FROM pjdke.rechnung r
                                   JOIN pjdke.bestellpos bp ON r.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   'Ware eingegangen'             AS 'type',
                                   eingangsts                     AS 'when'
                                 FROM pjdke.wareneingang w
                                   JOIN pjdke.bestellpos bp ON w.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   'Zahlung durchgeführt'         AS 'type',
                                   zahlts                         AS 'when'
                                 FROM pjdke.zahlung z
                                   JOIN (SELECT
                                           bestellnr,
                                           posnr,
                                           concat(posnr, bestellnr) AS 'joinId'
                                         FROM pjdke.bestellpos) bp ON bp.joinId = z.id)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   'Kreditor entsperrt'           AS 'type',
                                   aenderts                       AS 'when'
                                 FROM (SELECT
                                         id,
                                         aenderts
                                       FROM pjdke.änderungshistorie
                                       WHERE
                                         tabelle = 'Kreditor' AND wertAlt = '' AND
                                         pjdke.änderungshistorie.wertNeu = 'X') d
                                   JOIN pjdke.bestellung b ON d.id = b.krednr
                                   JOIN pjdke.bestellpos bp ON b.bestellnr = bp.bestellnr)
                          UNION (SELECT
                                   concat(bp.bestellnr, bp.posnr) AS 'id',
                                   a.type,
                                   a.`when`
                                 FROM (SELECT
                                         id                     AS 'bestellnr',
                                         'Bestellung storniert' AS 'type',
                                         aenderts               AS 'when'
                                       FROM pjdke.änderungshistorie
                                       WHERE tabelle = 'pjdke.bestellung' AND feld = 'StornoKZ') a
                                   JOIN pjdke.bestellpos bp ON a.bestellnr = bp.bestellnr)) t