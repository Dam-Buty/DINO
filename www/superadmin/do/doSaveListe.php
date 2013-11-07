<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "DELETE FROM `valeur_champ` WHERE `fk_champ` = " . $_POST["champ"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_client` = " . $_POST["client"] . ";";
    
    foreach(explode(PHP_EOL, $_POST["liste"]) as $ligne) {
        if ($ligne != "") {
            $champs = explode(",", $ligne);
            $query .= "INSERT INTO `valeur_champ` (`pk_valeur_champ`, `label_valeur_champ`, `fk_champ`, `fk_monde`, `fk_client`) VALUES (" . $champs[0] . ", '" . $champs[1] . "', " . $_POST["champ"] . ", " . $_POST["monde"] . ", " . $_POST["client"] . ");";
        }
    }
    
    if ($mysqli->multi_query($query)) {
        $i = 0; 
        do { 
            $i++; 
        } while ($mysqli->next_result()); 
        
        if (!$mysqli->errno) { 
            status(200);
        } else {
            status(500);
            $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
        }
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
