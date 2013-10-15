<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "DELETE FROM `monde` WHERE `pk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";";
    
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
