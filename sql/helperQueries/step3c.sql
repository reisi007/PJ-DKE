CREATE TABLE graphData AS (
  SELECT
    up.n                                                            AS route,
    timestampdiff(SECOND, tsCur, tsNext)                            AS deltaSeconds,
    f.cur                                                           AS 'from',
    f.next                                                          AS 'to',
    if(isnull(f.prev), 'start', if(isnull(f.next), 'end', 'inner')) AS nodetype
  FROM flow f JOIN routeinfo r ON f.bestellnr = r.bestellNr
    JOIN uniquepaths up ON r.ihash = up.ihash)