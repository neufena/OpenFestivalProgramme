<?php

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

date_default_timezone_set('Europe/London');
require_once('../includes/config.php');
require_once('../includes/databaseClass.php');
require_once '../includes/programmeClass.php';
$db = new database($driver, $host, $database, $username, $password);
$prog = new programme($db);

if (!isset($_GET['action'])) {
    die('no action requested');
}

switch ($_GET['action']) {
    case 'getVersion':
        $version = array();
        $version['appVersion'] = $prog->getAppVersion();
        $version['dbVersion'] = $prog->getDBVersion();
        echo json_encode($version);
        break;
    case 'getData';
        $data = $prog->getAllData();
        echo json_encode($data);
        break;
}
?>
