SELECT
  `from`   AS 'type',
  count(*) AS cnt
FROM graphdata
WHERE route IN (%s) OR '%s' = 0
GROUP BY `from`
ORDER BY cnt DESC;