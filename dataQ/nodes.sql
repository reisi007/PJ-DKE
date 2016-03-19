SELECT
  `from` AS 'node',
  nodetype
FROM graphdata
WHERE route IN (%s) || 0 = '%s'
GROUP BY `from`, nodetype;