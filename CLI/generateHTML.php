<?php
require_once '../includes/programmeClass.php';
$prog = new programme();
ob_start();
$prog->getAllData();
ob_flush();


?>
