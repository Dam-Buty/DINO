<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "SELECT CONCAT_WS(',', `pk_valeur_champ`, `label_valeur_champ`) AS `ligne` FROM `valeur_champ` WHERE `fk_champ` = " . $_POST["champ"] . ";";
    
    if ($result = $mysqli->query($query)) {
        $text = "";
        while ($row = $result->fetch_assoc()) {
            $text .= $row["ligne"] . "\n";
        }
        
        status(200);
        header('Content-Type: text/plain');
        echo $text;
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
        header('Content-Type: application/json');
        echo $json;
    }
}
?>