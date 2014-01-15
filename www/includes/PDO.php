<?php
function dino_query($query, $params = []) {
#    $hostname = "localhost";
#    $username = "dino_baby_root";
#    $dbname = "dino_baby";
#    $password = "C4dillac5";

    $hostname = "localhost";
    $username = "root";
    $dbname = "dino_baby";
    $password = "C4dillac5";
    
#    echo $query;
#    var_dump($params);

    try {
        $dbh = new PDO("mysql:host=" . $hostname . ";dbname=" . $dbname, $username, $password);
    } catch (PDOException $e) {
        return [
            "status" => false,
            "errno" => $dbh->errorCode(),
            "errinfo" => $dbh->errorInfo()
        ];
    }
    
    $query_type = substr(trim($query), 0, 6);
    
    try {
        $stmt = $dbh->prepare($query);
        
        if ($stmt->execute($params)) {
            switch($query_type) {
                case "SELECT":
                    return [
                        "status" => true,
                        "result" => $stmt->fetchAll()
                    ];
                    break;
                case "INSERT":
                    return [
                        "status" => true,
                        "result" => $dbh->lastInsertId()
                    ];
                    break;
                case "UPDATE":
                    return [
                        "status" => true,
                        "result" => $stmt->rowCount()
                    ];
                    break;
                case "DELETE":
                    return [
                        "status" => true,
                        "result" => $stmt->rowCount()
                    ];
                    break;
            }
        } else {
            return [
                "status" => false,
                "errno" => $stmt->errorCode(),
                "errinfo" => $stmt->errorInfo()
            ];
        }
    } catch (PDOException $e) {
        return [
            "status" => false,
            "errno" => $stmt->errorCode(),
            "errinfo" => $stmt->errorInfo()
        ];
    }
    return $return;
}
?>
