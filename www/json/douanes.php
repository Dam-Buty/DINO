<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/log.php");
    include("../includes/mysqli.php");

    $first = 1;
    
    $json = '[';
    
    $query = "SELECT (SELECT COUNT( * ) FROM  `client_douane` AS cd WHERE  `client` = " . $_SESSION["client"] . " AND  `douane`.`code_douane` =  `cd`.`douane` ) AS `client_OK`,  `code_douane` ,  `nom_douane` FROM  `douane` AS douane ORDER BY  `client_OK` DESC, `nom_douane` ;";
    
    if ($result = $mysqli->query($query)) {
        while ($row = $result->fetch_assoc()) {
            if (!$first) {
                $json .= ',';
            } else {
                $first = 0;            
            }
            
            $json .= '{ "OK" : "' . $row["client_OK"] . '", "code" : "' . $row["code_douane"] . '", "nom" : "' . $row["nom_douane"] . '" }';
        }
        $result->free();
        $json .= "]";
    } else {
        $json .= '"error" : "' . $mysqli->error . '"';
        $json .= "]";
    }
    header('Content-Type: application/json');
    echo $json;   
}


?>
