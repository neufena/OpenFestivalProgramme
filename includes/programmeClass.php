<?php

/**
 * Retrives and data for programme
 *
 * @author neufena
 * @todo Handle database errors correctly
 */

class programme {

    private $dbh;

    function __construct($dbh) {
        global $driver;
        global $host;
        global $database;
        global $username;
        global $password;
        $this->dbh = $dbh;
    }

    public function getDBVersion() {
        $sql = 'SELECT dbVersion FROM tblVersion';
        $result = $this->dbh->returnResult($sql);
        return $result[0]['dbVersion'];
    }

    public function getAppVersion() {
        $sql = 'SELECT appVersion FROM tblVersion';
        $result = $this->dbh->returnResult($sql);
        return $result[0]['appVersion'];
    }

    private function img2blob($image) {
        $imageData = file_get_contents($image);
        return json_encode($imageData);
    }

    private function getTable($table) {
        $sql = 'SELECT * FROM ' . $table;
        $result = $this->dbh->returnResult($sql);
        return $result;
    }

    public function getYouTubeIds() {
        $sql = 'SELECT video FROM tblAct WHERE video IS NOT NULL';
        $result = $this->dbh->returnResult($sql);
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
                $youtube = file_get_contents('../images/youtube/' . $act['video'] . '.jpg');
                $acts[$k]['videothumb'] = base64_encode($youtube);
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

function escapeSQLite(&$item) {
    $item = str_replace("'", "''", $item);
}

?>
