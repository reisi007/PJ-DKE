<?php
namespace at\pjdke\g3;
header('Content-Type: application/json');
const user = 'root';
const password = '1234';
const connectUrl = 'mysql:host=localhost:3306;dbname=pjdke;charset=utf8mb4';
$id = isset($_REQUEST['id']) ? $_REQUEST['id'] : '0';
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
 * @return array
 */
function execute($connection, $sql)
{
    $stmt = $connection->query($sql);
    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
}

/**
 * @param $connection \PDO
 * @param $sql string
 * @param $id integer
 * @return array
 */
function executeWithId($connection, $sql, $id)
{
    $exploded = explode(',', $id);
    foreach ($exploded as $value) {
        $value = $connection->quote($value);
    }
    $id = implode(',', $exploded);
    $sql = sprintf($sql, $id, $id);
    $stmt = $connection->query($sql);
    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
}


$connection = getConenction();
$result = [];
foreach (['nodes', 'links', 'nodestat', 'routestat'] as $name) {
    $sql = readFile("$name.sql");
    $result[$name] = executeWithId($connection, $sql, $id);
}

echo json_encode($result);
$connection->commit();
?>