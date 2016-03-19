SELECT
  `from`,
  `to`,
  avg(deltaSeconds) AS deltaSec,
  count(*)          AS cnt
FROM graphdata
WHERE nodetype != 'end' AND (route IN (%s) OR '%s' = 0)
GROUP BY `from`, `to`;