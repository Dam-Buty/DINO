<?php
session_start();
include("../includes/status.php");

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    
    $query = "INSERT INTO `document` (`nom_temp_document`, `fk_client`) VALUES ('" . $_FILES["document"]["name"] . "', " . $_SESSION["client"] . ");";
    
    if ($mysqli->query($query)) {
        $timestamp = date("Ymd");
        
        if (move_uploaded_file($_FILES['document']['tmp_name'], "../cache/" . $_SESSION["client"] . "/temp/" . $timestamp . "_" . $_FILES["document"]["name"])) {
            status(201);
            $json = '{ "status": "OK", filename: "' . $timestamp . '_' . $_FILES["document"]["name"] . '" }';
        } else {
            status(500);
            $json = '{ "error": "move_uploaded_file" }';
        }
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
