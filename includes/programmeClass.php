<?php

/**
 * Retrives and data for programme
 *
 * @author neufena
 * @todo Handle database errors correctly
 */
class programme
{

    private $dbh;

    function __construct($dbh)
    {
        $this->dbh = $dbh;
    }

    public function getDBVersion()
    {
        $sql = 'SELECT dbVersion FROM tblVersion';
        $result = $this->dbh->returnResult($sql);
        return $result[0]['dbVersion'];
    }

    public function getAppVersion()
    {
        $sql = 'SELECT appVersion FROM tblVersion';
        $result = $this->dbh->returnResult($sql);
        return $result[0]['appVersion'];
    }

    public function getImgVersion()
    {
        $sql = 'SELECT imgVersion FROM tblVersion';
        $result = $this->dbh->returnResult($sql);
        return $result[0]['imgVersion'];
    }

    private function getTable($table)
    {
        $sql = 'SELECT * FROM ' . $table;
        $result = $this->dbh->returnResult($sql);
        return $result;
    }

    public function getYouTubeIds()
    {
        $sql = 'SELECT video FROM tblAct WHERE video IS NOT NULL';
        $result = $this->dbh->returnResult($sql);
        return $result;
    }

    public function getAllData()
    {
        $acts = $this->getTable('tblAct');
        foreach ($acts as $k => $act) {
            if ($act['image'] != '') {
                $acts[$k]['image'] = 'http://' . $_SERVER['HTTP_HOST'] . '/images/' . $act['image'];
            }
            if ($act['video'] != '') {
                $acts[$k]['videothumb'] = 'http://' . $_SERVER['HTTP_HOST'] . '/images/youtube/' . $act['video'] . '.jpg';
            }
        }
        $versions = array(
            0 => array(
                'appVersion' => $this->getAppVersion(),
                'dbVersion' => $this->getDBVersion()
            )
        );

        $allData = array(
            'tblAct' => $acts,
            'tblActStage' => $this->getTable('tblActStage'),
            'tblEvent' => $this->getTable('tblEvent'),
            'tblStage' => $this->getTable('tblStage'),
            'tblVersion' => $versions
        );

        array_walk_recursive($allData, 'escapeSQLite');

        return $allData;
    }

    public function getAllImages()
    {
        $acts = $this->getTable('tblAct');
        $rtn = array(
            0 => array (
                'imgVersion' => $this->getImgVersion()
            )
        );
        foreach ($acts as $act) {

            $id = $act['id'];
            if ($act['image'] != '' || $act['video'] != '') {
                $rtn[$id] = array();
            }
            if ($act['image'] != '') {
                $img = file_get_contents('../images/' . $act['image']);
                $rtn[$id]['image'] = base64_encode($img);
            }
            if ($act['video'] != '') {
                $youtube = file_get_contents('../images/youtube/' . $act['video'] . '.jpg');
                $rtn[$id]['videothumb'] = base64_encode($youtube);
            }
        }

        return $rtn;
    }

}

function escapeSQLite(&$item)
{
    $item = str_replace("'", "''", $item);
}

?>
