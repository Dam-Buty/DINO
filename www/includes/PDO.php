<?php

function dino_query($query_name, $params = []) {
#    $hostname = "127.0.0.1";
#    $username = "dino_prod_root";
#    $dbname = "dino_prod";
#    $password = "G00D_2-e4t-1000_yrz!"; 
#header("Content-Type: text/html; charset=UTF-8");

    global $queries;

    $hostname = "localhost";
    $username = "root";
    $dbname = "dino";
    $password = "C4dillac5";
    
#    echo $query;
#    var_dump($params);

#    echo "<br/>======<br/>" . $query . "<br/><br/>";
#    var_dump($params);
#    echo "<br/><br/>";

    $query_array = explode("\n", file_get_contents("../sql/" . $query_name . ".sql"));
    
    $message = array_shift($query_array);
    $query = implode("\n", $query_array);
    
    $query_type = substr(trim(explode("\n", $query)[1]), 0, 6);
    
    try {
        $dbh = new PDO("mysql:host=" . $hostname . ";dbname=" . $dbname . ";charset=utf8", $username, $password,[ 
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET time_zone = \'-06:00\''
        ]);
        
        $stmt = $dbh->prepare($query);
        
        if ($stmt->execute($params)) { // OK
            dino_log([
                "niveau" => "I",
                "message" => $message,
                "query" => $query_name
            ]);
            
            switch($query_type) {
                case "SELECT":
                    $return = [
                        "status" => true,
                        "result" => $stmt->fetchAll()
                    ];
                    break;
                case "INSERT":
                    $return = [
                        "status" => true,
                        "result" => $dbh->lastInsertId()
                    ];
                    break;
                case "UPDATE":
                    $return = [
                        "status" => true,
                        "result" => $stmt->rowCount()
                    ];
                    break;
                case "DELETE":
                    $return = [
                        "status" => true,
                        "result" => $stmt->rowCount()
                    ];
                    break;
            }
        } else { // Erreur exécution query
            dino_log([
                "niveau" => "E",
                "query" => $query_name,
                "errno" => $stmt->errorCode(),
                "errinfo" => $stmt->errorInfo()[2],
                "params" => json_encode($params)
            ]);
            
            $return = [
                "status" => false
            ];
        }
    } catch (PDOException $e) { // Erreur connection BdD
        dino_log([
            "niveau" => "X",
            "message" => "Erreur de connexion à la base de données!",
            "errinfo" => $e->getMessage()
        ]);
        $return = [
            "status" => false
        ];
    }
    
    $dbh = null;
    return $return;
}
?>
