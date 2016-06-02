CREATE TABLE routeStat AS SELECT
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
                                        FROM uniquePaths up
                                          JOIN routeInfo ri ON up.ihash = ri.ihash
                                        GROUP BY up.n
                                        ORDER BY cnt DESC, routeId
                                      ) a, (SELECT count(*) AS 'value'
                                            FROM routeInfo) total) a, (SELECT @n := 0) m