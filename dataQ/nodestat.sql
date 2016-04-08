SELECT
  `from`   AS 'type',
  count(*) AS cnt
FROM graphdata
WHERE route IN (%s)
GROUP BY `from`
ORDER BY cnt DESC;