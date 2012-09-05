<?php

/**
 * Base database class,
 * 
 * @todo move DB configuration to a config file
 * @todo Refactor for better error handling
 *
 * @author neufena
 */
require_once __DIR__ . '/../config.php';

class database {

    private $db;
    private $driver;
    private $host;
    private $database;
    private $username;
    private $password;

    function __construct($driver, $host, $database, $username, $password) {
        $this->driver = $driver;
        $this->host = $host;
        $this->database = $database;
        $this->username = $username;
        $this->password = $password;
            $this->db = new PDO($this->driver . ':host=' . $this->host .
                ';dbname=' . $this->database, $this->username, $this->password);
        return true;
    }

    public function execSQL($sql, $args=array()) {
        $stmt = $this->db->prepare($sql);
        if (isset($args[0]) && is_array($args[0])) {
            foreach ($args as $arg) {
                $stmt->execute($arg);
            }
        } else {
            $stmt->execute($args);
        }
        return true;
    }

    public function returnResult($sql, $args=array()) {
        $stmt = $this->db->prepare($sql);
        if (isset($args[0]) && is_array($args[0])) {
            $result = array();
            foreach ($args as $arg) {
                $stmt->execute($arg);
                
                $result[] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            return $result;
        } else {
            $stmt->execute($args);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        return true;
    }
    
    

}

?>
