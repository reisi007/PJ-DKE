SELECT
  `from`,
  `to`,
  avg(deltaSeconds) AS deltaSec,
  count(*)          AS cnt
FROM graphdata
WHERE nodetype != 'end' AND route IN (%s)
GROUP BY `from`, `to`;