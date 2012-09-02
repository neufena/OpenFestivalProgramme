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
        $this->db = new database();
    }
    
    public function getDBVersion() {
        $sql='SELECT dbVersion FROM tblVersion';
        $result = $this->db->returnResult($sql);
        return $result[0]['dbVersion'];
    }
    
    public function getAppVersion() {
        $sql='SELECT appVersion FROM tblVersion';
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
        $result = $this->db->returnResult($sql,array($act));
        return $result[0];
    }
    
}

?>
