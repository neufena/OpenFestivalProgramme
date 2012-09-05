<?php

/**
 * Retrives and data for programme
 *
 * @author neufena
 * @todo Handle database errors correctly
 */
require_once('databaseClass.php');

class programme {

    private $db;

    function __construct() {
        global $driver;
        global $host;
        global $database;
        global $username;
        global $password;
        $this->db = new database($driver, $host, $database, $username, $password);
    }

    public function getDBVersion() {
        $sql = 'SELECT dbVersion FROM tblVersion';
        $result = $this->db->returnResult($sql);
        return $result[0]['dbVersion'];
    }

    public function getAppVersion() {
        $sql = 'SELECT appVersion FROM tblVersion';
        $result = $this->db->returnResult($sql);
        return $result[0]['appVersion'];
    }

    public function getEvent() {
        $sql = 'SELECT name, UNIX_TIMESTAMP(eventDate) AS eventDate, venue FROM tblEvent';
        $result = $this->db->returnResult($sql);
        return $result[0];
    }

    public function getStages() {
        $sql = 'SELECT id, REPLACE(name," ","") AS shortname, name FROM tblStage ORDER BY displayOrder ASC';
        $result = $this->db->returnResult($sql);
        return $result;
    }

    public function getActsOnStage($stage) {
        $sql = 'SELECT id, REPLACE(name," ","") AS shortname, name, time, page
            FROM tblActStage, tblAct WHERE actID = id AND stageID = ? ORDER BY time DESC';
        $result = $this->db->returnResult($sql, array($stage));
        return $result;
    }

    public function getActs() {
        $sql = 'SELECT id, REPLACE(name," ","") AS shortname, name, description, image, video, website 
            FROM tblAct WHERE page IS NULL ORDER BY name ASC';
        $result = $this->db->returnResult($sql);
        return $result;
    }

    public function getAct($act) {
        $sql = 'SELECT id, REPLACE(name," ","") AS shortname, name, description, image, video, website 
            FROM tblAct WHERE id = ?';
        $result = $this->db->returnResult($sql, array($act));
        return $result[0];
    }

    public function getCreateSQL() {
        return array (
            'CREATE TABLE "tblAct" (
            "id" int(11)  NOT NULL ,
            "name" varchar(255) NOT NULL DEFAULT \'\',
            "description" text,
            "image" varchar(100) DEFAULT NULL,
            "video" varchar(255) DEFAULT NULL,
            "website" varchar(255) DEFAULT NULL,
            "page" varchar(100) DEFAULT NULL,
            PRIMARY KEY ("id")
            )',
            
            'CREATE TABLE "tblActStage" (
            "day" int(11) NOT NULL DEFAULT \'1\',
            "stageID" int(11)  NOT NULL,
            "actID" int(11) NOT NULL DEFAULT \'0\',
            "time" time DEFAULT NULL,
            "duration" float DEFAULT NULL
            )',
            
            'CREATE TABLE "tblVersion" (
            "appVersion" decimal(3,1)  NOT NULL,
            "dbVersion" decimal(3,1)  NOT NULL
            )',
            
            'CREATE TABLE "tblEvent" (
            "id" int(11)  NOT NULL ,
            "name" varchar(255) DEFAULT NULL,
            "eventDate" date DEFAULT NULL,
            "days" int(11) DEFAULT NULL,
            "venue" varchar(100) DEFAULT NULL,
            PRIMARY KEY ("id")
            )',
            
            'CREATE TABLE "tblStage" (
            "id" int(11)  NOT NULL ,
            "name" varchar(100) NOT NULL DEFAULT \'\',
            "displayOrder" int(11) NOT NULL,
            "publishTimes" tinyint(1) NOT NULL DEFAULT \'1\',
            PRIMARY KEY ("id")
            )'
            
            
        );
    }
    private function img2blob($image) {
        $imageData = file_get_contents($image);
        return json_encode($imageData);
    }
    private function getTable($table) {
        $sql = 'SELECT * FROM ' . $table;
        $result = $this->db->returnResult($sql);
        return $result;
    }
    
    public function getAllData() {
        $acts = $this->getTable('tblAct');
        foreach ($acts as $k => $act) {
            if($act['image']!='') {
                $img = file_get_contents('../images/' . $act['image']);
                $acts[$k]['image'] = base64_encode($img);
            }
            if($act['video']!='') {
                //$youtube = file_get_contents('http://img.youtube.com/vi/'.$act['video'].'/0.jpg');
                //$acts[$k]['video'] = base64_encode($youtube);
                $acts[$k]['video'] = '';
            }
        }
        $allData = array (
            'tblAct'      => $acts,
            'tblActStage' => $this->getTable('tblActStage'),
            'tblEvent'    => $this->getTable('tblEvent'),
            'tblStage'    => $this->getTable('tblStage'),
            'tblVersion'  => $this->getTable('tblVersion'),
            
        );
        
        
        
        return json_encode($allData);
    }
}

?>
