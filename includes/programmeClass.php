<?php

/**
 * Retrives and data for programme
 *
 * @author neufena
 * @todo Handle database errors correctly
 */

class programme {

    private $db;

    function __construct($db) {
        global $driver;
        global $host;
        global $database;
        global $username;
        global $password;
        $this->db = $db;
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
            if ($act['image'] != '') {
                $img = file_get_contents('../images/' . $act['image']);
                $acts[$k]['image'] = base64_encode($img);
            }
            if ($act['video'] != '') {
                //$youtube = file_get_contents('http://img.youtube.com/vi/'.$act['video'].'/0.jpg');
                //$acts[$k]['video'] = base64_encode($youtube);
                //$acts[$k]['video'] = '';
            }
        }
        $allData = array(
            'tblAct' => $acts,
            'tblActStage' => $this->getTable('tblActStage'),
            'tblEvent' => $this->getTable('tblEvent'),
            'tblStage' => $this->getTable('tblStage'),
            'tblVersion' => $this->getTable('tblVersion'),
        );

        array_walk_recursive($allData, 'escapeSQLite');
        
        return $allData;
    }

}

function escapeSQLite(&$item, $key) {
    $item = str_replace("'", "''", $item);
}

?>
