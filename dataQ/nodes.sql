SELECT
  `from` AS 'node',
  nodetype
FROM graphdata
WHERE route IN (%s)
GROUP BY `from`, nodetype;