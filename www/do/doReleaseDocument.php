<?php
session_start();
include("../includes/functions.php");  

if (isset($_SESSION["niveau"])) {
    
    try {
        $dino = new DINOSQL();
        
        $dino->query("release_document",[
            "client" => $_SESSION["client"],
            "filename" => $_POST["document"]
        ]);
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
        $dino->rollback();
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
