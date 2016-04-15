<?php
namespace at\pjdke\g3;
header('Content-Type: application/json');
const user = 'root';
const password = '1234';
const connectUrl = 'mysql:host=localhost:3306;dbname=pjdke;charset=utf8mb4';
if (isset($_REQUEST['id']) && isset($_REQUEST['percentage'])) {
    echo '{"error": -1}';
    exit();
}
/**
 * @return \PDO
 */
function getConenction()
{
    $connection = new \PDO(connectUrl, user, password);
    $connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    $connection->beginTransaction();
    return $connection;
}

/**
 * @param $filename string
 * @return string
 */
function readFile($filename)
{
    return file_get_contents('dataQ/' . $filename);
}

/**
 * @param $connection \PDO
 * @param $sql string
 * @param $explodedId array
 * @return array
 */
function executeWithId($connection, $sql, $explodedId)
{
    try {
        foreach ($explodedId as $value) {
            $value = $connection->quote($value);
        }
        $id = implode(',', $explodedId);
        $sql = sprintf($sql, $id, $id);
        $stmt = $connection->query($sql);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    } catch (\PDOException $e) {
        var_dump($sql);
        var_dump($explodedId);
        throw $e;
    }
}

//Start 'main'
$connection = getConenction();

if (isset($_REQUEST['id']))
    $id = $_REQUEST['id'];
else {
    $p = $_REQUEST['percentage'];
    $sql = 'SELECT routeId FROM routestat WHERE coverage <= ifnull((SELECT min(coverage) AS minCov FROM routestat WHERE coverage >= :percentage/100),1)';
    $pstmt = $connection->prepare($sql);
    $pstmt->bindParam(':percentage', $p);
    $pstmt->execute();
    $column = $pstmt->fetchAll(\PDO::FETCH_COLUMN, 0);
    if (empty($column)) {

    }
    $id = implode(',', $column);
}
$exploded = explode(',', $id);

$result = [];
foreach (['nodes', 'links', 'nodestat', 'routestat', 'selectedPercentage'] as $name) {
    $sql = readFile("$name.sql");
    $result[$name] = executeWithId($connection, $sql, $exploded);
}
$result['ids'] = $exploded;
echo json_encode($result);
$connection->commit();
?>