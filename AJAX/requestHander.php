<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

date_default_timezone_set('Europe/London');
require_once('../config.php');
require_once '../includes/programmeClass.php';
$prog = new programme();

if(!isset($_GET['action'])) {die('no action requested');}

switch ($_GET['action']) {
    case 'getVersion':
        $version = array();
        $version[] = $prog->getAppVersion();
        $version[] = $prog->getDBVersion();
        echo json_encode($version);
        break;
    case 'getData';
       echo $prog->getAllData();
}

?>
