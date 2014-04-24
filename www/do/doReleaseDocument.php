<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/DINOSQL.php");
    
    try {
        $dino = new DINOSQL();
        
        $dino->query("release_document",[
            "client" => $_SESSION["client"],
            "filename" => $_POST["document"]
        ]);
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
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
