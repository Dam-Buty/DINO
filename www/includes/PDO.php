<?php
function dino_query($query, $params = []) {
#    $hostname = "127.0.0.1";
#    $username = "dino_prod_root";
#    $dbname = "dino_prod";
#    $password = "G00D_2-e4t-1000_yrz!"; 
#header("Content-Type: text/html; charset=UTF-8");

    $hostname = "localhost";
    $username = "root";
    $dbname = "dino";
    $password = "C4dillac5";
    
#    echo $query;
#    var_dump($params);

#    echo "<br/>======<br/>" . $query . "<br/><br/>";
#    var_dump($params);
#    echo "<br/><br/>";

    $query_type = substr(trim($query), 0, 6);
    
    try {
        $dbh = new PDO("mysql:host=" . $hostname . ";dbname=" . $dbname . ";charset=utf8", $username, $password,[ 
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET time_zone = \'-06:00\''
        ]);
        
        $stmt = $dbh->prepare($query);
        
        if ($stmt->execute($params)) {
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
        } else {
            $return = [
                "status" => false,
                "errno" => $stmt->errorCode(),
                "errinfo" => $stmt->errorInfo()
            ];
        }
    } catch (PDOException $e) {
        $return = [
            "status" => false,
            "errno" => 500,
            "errinfo" => ["", "", $e->getMessage()]
        ];
    }
    
    $dbh = null;
    return $return;
}
?>
