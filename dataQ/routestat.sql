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
              FROM uniquepaths up
                JOIN routeinfo ri ON up.ihash = ri.ihash
              GROUP BY up.n
              ORDER BY cnt DESC
            ) a, (SELECT count(*) AS 'value'
                  FROM routeinfo) total) a, (SELECT @n := 0) m;