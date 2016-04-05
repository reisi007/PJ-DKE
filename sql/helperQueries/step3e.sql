CREATE TABLE naccRouteStats AS SELECT
                                 a.routeId,
                                 (a.cnt / total.value) AS 'coverage'
                               FROM (
                                      SELECT
                                        up.n            AS 'routeId',
                                        count(ri.ihash) AS cnt
                                      FROM uniquepaths up
                                        JOIN routeinfo ri ON up.ihash = ri.ihash
                                      GROUP BY up.n
                                      ORDER BY cnt DESC
                                    ) a, (SELECT count(*) AS 'value'
                                          FROM routeinfo) total;