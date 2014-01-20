<?php
function dino_query($query, $params = []) {
    $hostname = "127.0.0.1";
    $username = "dino_baby_root";
    $dbname = "dino_baby";
    $password = "C4dillac5"; 
#header("Content-Type: text/html; charset=UTF-8");

#    $hostname = "localhost";
#    $username = "root";
#    $dbname = "dino_baby";
#    $password = "C4dillac5";
    
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
    // utf8_encode_deep($return);
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

function utf8_decode_deep(&$input) {
    if (is_string($input)) {
        $input = utf8_decode($input);
    } else if (is_array($input)) {
        foreach ($input as &$value) {
            utf8_decode_deep($value);
        }

        unset($value);
    } else if (is_object($input)) {
        $vars = array_keys(get_object_vars($input));

        foreach ($vars as $var) {
            utf8_decode_deep($input->$var);
        }
    }
}
?>
