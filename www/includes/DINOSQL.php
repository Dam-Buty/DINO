<?php
//////////////////////////////////////////////
// DINOSQL v1.0
// - Gère transactionellement les requêtes MySQL

class DINOSQL {
#    private $hostname = "127.0.0.1";
#    private $username = "dino_prod_root";
#    private $dbname = "dino_prod";
#    private $password = "G00D_2-e4t-1000_yrz!"; 
#####################
#    private $hostname = "127.0.0.1";
#    private $username = "dino_baby_root";
#    private $dbname = "dino_baby";
#    private $password = "C4dillac5"; 
#####################
    private $hostname = "localhost";
    private $username = "root";
    private $dbname = "dino";
    private $password = "C4dillac5";
    
    private $options = [
        PDO::ATTR_PERSISTENT         => true,
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET time_zone = '-06:00'"
    ];
    
    private $dsn;
    private $dbh;
    
    public function __construct() {
        try {
            $this->dsn = "mysql:host=" . $this->hostname . ";dbname=" . $this->dbname . ";charset=utf8";
            $this->dbh = new PDO($this->dsn, $this->username, $this->password, $this->options);
            
            $this->dbh->beginTransaction();
        } catch (PDOException $e) { // Erreur connection BdD
            dino_log([
                "niveau" => "X",
                "message" => "Erreur de connexion à la base de données!",
                "errinfo" => $e->getMessage()
            ]);
            
            throw new Exception("Erreur de connection", 1);
        }
    }
    
    public function query($query_name, $params = [], $substitutions = []) {
        $query_array = explode("\n", file_get_contents("../sql/" . $query_name . ".sql"));
        
        $message = array_shift($query_array);
        $query = implode("\n", $query_array);
        
        $query_type = substr(trim(explode("\n", $query)[0]), 0, 6);
        
        if (count($substitutions) > 0) {
            foreach($substitutions as $key => $value) {
                $query = str_replace("%" . $key . "%", $value, $query);
            }
        }
            
        $stmt = $this->dbh->prepare($query);
        
        try {
            $stmt->execute($params);
            
            dino_log([
                "niveau" => "I",
                "message" => $message,
                "query" => $query_name
            ]);
            
            switch($query_type) {
                case "SELECT":
                    return $stmt->fetchAll();
                case "INSERT":
                    return $this->dbh->lastInsertId();
                case "UPDATE":
                    return $stmt->rowCount();
                case "DELETE":
                    return $stmt->rowCount();
            }
        } catch (Exception $e) {
            $this->dbh->rollback();
            $this->dbh = null;
            
            dino_log([
                "niveau" => "E",
                "query" => $query_name,
                "errno" => $stmt->errorCode(),
                "errinfo" => $stmt->errorInfo()[2],
                "params" => json_encode($params) . "," . json_encode($substitutions)
            ]);
            
            throw new Exception("Erreur de requete", 2);
        }
    }
    
    public function commit() {
        $this->dbh->commit();
        $this->dbh = null;
    }
    
    public function rollback() {
        $this->dbh->rollback();
        $this->dbh = null;
    }
}
?>
