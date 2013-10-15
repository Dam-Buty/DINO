<?php
session_start();
include("../includes/status.php");

if ($_SESSION["niveau"] > 10) {
    include("../includes/mysqli.php");
    
    if (unlink("../cache/" . $_SESSION["client"] . "/" . $_POST["filename"] . ".css")) {
        $query = "DELETE FROM `document` WHERE `nom_temp_document` = '" . $_POST["filename"] . "';";
        
        if ($mysqli->query($query)) {
            status(204);
            $json = "";
        } else {
            status(500);
            $json = '{ "error": "mysql", "query": "' . $query . '", "message": "' . $mysqli-error . '" }';
        }
    } else {
        status(500);
        $json = '{ "error": "unknown" }';
    }
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
