<?php
date_default_timezone_set('Europe/London');
require_once('../includes/config.php');
require_once('../includes/databaseClass.php');
require_once '../includes/programmeClass.php';
$db = new database( $driver, $host, $database, $username, $password);
$prog = new programme($db);

$youTubeIds = $prog->getYouTubeIds();

foreach ($youTubeIds as $id) {
    $youtube = file_get_contents('http://img.youtube.com/vi/'.$id['video'].'/0.jpg');
    //Store in the filesystem.
    $fp = fopen('../images/youtube/' . $id['video'] . '.jpg', 'w');
    fwrite($fp, $youtube);
    fclose($fp);

}
?>
