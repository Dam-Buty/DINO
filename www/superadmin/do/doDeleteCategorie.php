<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "DELETE FROM `categorie_doc` WHERE `pk_categorie_doc` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . " AND `fk_monde` = " . $_POST["monde"] . "; DELETE FROM `type_doc` WHERE `fk_categorie` = " . $_POST["categorie"] . " AND `fk_client` = " . $_POST["client"] . " AND `fk_monde` = " . $_POST["monde"] . ";";
    
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
