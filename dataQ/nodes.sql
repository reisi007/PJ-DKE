SELECT
  `from` AS 'node',
  nodetype
FROM graphData
WHERE route IN (%s)
GROUP BY `from`, nodetype;