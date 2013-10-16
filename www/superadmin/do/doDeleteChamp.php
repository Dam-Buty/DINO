<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "DELETE FROM `champ` WHERE `pk_champ` = " . $_POST["pk"] . "; DELETE FROM `monde_champ` WHERE `fk_client` = " . $_POST["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_champ` = " . $_POST["pk"] . "; DELETE FROM `valeur_champ` WHERE `fk_champ` = " . $_POST["pk"] . ";";
    
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
