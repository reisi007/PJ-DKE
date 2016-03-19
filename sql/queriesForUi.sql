--Select al Nodes
SELECT
  `from` AS 'node',
  nodetype
FROM graphdata
GROUP BY `from`, nodetype
--Select all nodes from route 7
SELECT
  `from` AS 'node',
  nodetype
FROM graphdata
WHERE route = 7
GROUP BY `from`, nodetype
--Select route statistic
SELECT
  a.routeId,
  round((@n := @n + prec) + 0.0001, 4) AS coverage
FROM (
       SELECT
         a.routeId,
         (a.cnt / total.value) AS 'prec'
       FROM (
              SELECT
                up.n            AS 'routeId',
                count(ri.ihash) AS cnt
              FROM uniquepaths up JOIN routeinfo ri ON up.ihash = ri.ihash
              GROUP BY up.n
              ORDER BY cnt DESC
            ) a, (SELECT count(*) AS 'value'
                  FROM routeinfo) total) a, (SELECT @n := 0) m
--Get connector info
SELECT
  `from`,
  `to`,
  avg(deltaSeconds) AS deltaSec,
  count(*)          AS cnt
FROM graphdata
WHERE nodetype != 'end'
GROUP BY `from`, `to`
--Get connector info for route 7
SELECT
  `from`,
  `to`,
  avg(deltaSeconds) AS deltaSec,
  count(*)          AS cnt
FROM graphdata
WHERE nodetype != 'end' AND route = 7
GROUP BY `from`, `to`
--Get node occurence statistic
SELECT
  `from`   AS 'type',
  count(*) AS cnt
FROM graphdata
GROUP BY `from`
ORDER BY cnt DESC 
--Get node occurence statistic or route 7
SELECT
  `from`   AS 'type',
  count(*) AS cnt
FROM graphdata
WHERE route = 7
GROUP BY `from`
ORDER BY cnt DESC