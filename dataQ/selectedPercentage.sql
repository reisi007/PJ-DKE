SELECT ifnull(round(sum(coverage * 100), 1), 0) AS percentage
FROM naccRouteStats
WHERE routeId IN (%s)