<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "DELETE FROM `type_doc` WHERE `pk_type_doc` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_champ` = " . $_POST["champ"] . " AND `fk_categorie_doc` = " . $_POST["categorie"] . ";";
    
    if ($mysqli->query($query)) {
        status(200);
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
