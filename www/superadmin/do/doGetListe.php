<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "SELECT 
                `label_valeur_champ`
                FROM `valeur_champ` 
                WHERE `fk_champ` = " . $_POST["champ"] . "
                    AND  `fk_client` = " . $_POST["client"] . " 
                    AND `fk_monde` = " . $_POST["monde"] . ";";
    
    if ($result = $mysqli->query($query)) {
        $text = "";
        while ($row = $result->fetch_assoc()) {
            $text .= $row["label_valeur_champ"] . "\n";
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
