SELECT
  `from`   AS 'type',
  count(*) AS cnt
FROM graphData
WHERE route IN (%s)
GROUP BY `from`
ORDER BY cnt DESC, type;