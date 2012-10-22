<?php

date_default_timezone_set('Europe/London');
require_once('../includes/config.php');
require_once('../includes/databaseClass.php');
require_once '../includes/programmeClass.php';
$db = new database($driver, $host, $database, $username, $password);
$prog = new programme($db);

$youTubeIds = $prog->getYouTubeIds();

$srcimage = imagecreatefrompng('../css/images/30-circle-play@2x.png');

$watermarkWidth = imagesx($srcimage);
$watermarkHeight = imagesy($srcimage);
$watermark = imagecreatetruecolor($watermarkWidth, $watermarkHeight);


imagecopyresampled($watermark, $srcimage, 0, 0, 0, 0, $watermarkWidth,
        $watermarkHeight, $watermarkWidth, $watermarkHeight);

foreach ($youTubeIds as $id) {
    $ch = curl_init();
    $timeout = 5; // set to zero for no timeout
    curl_setopt($ch, CURLOPT_URL,
            'http://img.youtube.com/vi/' . $id['video'] . '/0.jpg');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    $youtube = curl_exec($ch);
    curl_close($ch);

    $image = imagecreatefromstring($youtube);
    $destX = (imagesx($image) / 2) - ($watermarkWidth / 2);
    $destY = (imagesy($image) / 2) - ($watermarkHeight / 2);
    imagecopymerge($image, $watermark, $destX, $destY, 0, 0, $watermarkWidth,
            $watermarkHeight, 100);


    imagejpeg($image, '../images/youtube/' . $id['video'] . '.jpg');
}
imagedestroy($watermark);
?>
