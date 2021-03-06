<?php

/**
 * Base database class,
 * 
 * @todo Refactor for better error handling
 *
 * @author neufena
 */
class database
{

    private $dbh;
    private $driver;
    private $host;
    private $database;
    private $username;
    private $password;

    function __construct($driver, $host, $database, $username, $password)
    {
        $this->driver = $driver;
        $this->host = $host;
        $this->database = $database;
        $this->username = $username;
        $this->password = $password;
        $this->dbh = new PDO($this->driver . ':host=' . $this->host .
                        ';dbname=' . $this->database, $this->username, $this->password);
        return TRUE;
    }

    public function execSQL($sql, $args = array())
    {
        $stmt = $this->dbh->prepare($sql);
        if (isset($args[0]) && is_array($args[0])) {
            foreach ($args as $arg) {
                $stmt->execute($arg);
            }
        } else {
            $stmt->execute($args);
        }
        return TRUE;
    }

    public function returnResult($sql, $args = array())
    {
        $stmt = $this->dbh->prepare($sql);
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
        return TRUE;
    }

}

?>
