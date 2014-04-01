<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php");
    
    $result_update = dino_query("release_document",[
        "client" => $_SESSION["client"],
        "filename" => $_POST["document"]
    ]);
    
    if ($result_update["status"]) {
        status(200);
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Release document : pas de niveau session"
    ]);
    status(403);
}
?>
