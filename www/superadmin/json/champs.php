<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "SELECT `pk_champ`, `label_champ`, `pluriel_champ`               
            FROM `champ` AS `c` 
            WHERE `fk_monde` = " . $_POST["monde"] . "
                AND `fk_client` = " . $_POST["client"] . "
            ORDER BY `pk_champ` ASC";
    
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = "[ ";
        while ($row = $result->fetch_assoc()) {
            if ($json != "[ ") {
                $json .= ", ";
            }
            
            $json .= '{ "pk": "' . $row["pk_champ"] . '", "label": "' . $row["label_champ"] . '", "pluriel": "' . $row["pluriel_champ"] . '" }';
        }
        
        $json .= " ]";
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
