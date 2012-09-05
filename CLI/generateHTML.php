<?php
require_once '../includes/programmeClass.php';
$prog = new programme();
$prog->getAllData();
file_put_contents(__DIR__ . '/../database/initData.json', $prog->getAllData());
?>
