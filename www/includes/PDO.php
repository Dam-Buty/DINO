<?php
function dino_query($query, $params = []) {
    $hostname = "127.0.0.1";
    $username = "dino_baby_root";
    $dbname = "dino_baby";
    $password = "C4dillac5";

#    $hostname = "localhost";
#    $username = "root";
#    $dbname = "dino_baby";
#    $password = "C4dillac5";
    
#    echo $query;
#    var_dump($params);

#    echo "<br/>======<br/>" . $query . "<br/><br/>";
#    var_dump($params);
#    echo "<br/><br/>";

    try {
        $dbh = new PDO("mysql:host=" . $hostname . ";dbname=" . $dbname, $username, $password);
    } catch (PDOException $e) {
        $return = [
            "status" => false,
            "errno" => 500,
            "errinfo" => $e->getMessage()
        ];
    }
    
    $query_type = substr(trim($query), 0, 6);
    
    try {
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
            "errno" => $stmt->errorCode(),
            "errinfo" => $stmt->errorInfo()
        ];
    }
    
    $dbh = null;
#    var_dump($return["result"]);
    utf8_encode_deep($return);
    return $return;
}

function utf8_encode_deep(&$input) {
    if (is_string($input)) {
        $input = utf8_encode($input);
    } else if (is_array($input)) {
        foreach ($input as &$value) {
            utf8_encode_deep($value);
        }

        unset($value);
    } else if (is_object($input)) {
        $vars = array_keys(get_object_vars($input));

        foreach ($vars as $var) {
            utf8_encode_deep($input->$var);
        }
    }
}
?>
