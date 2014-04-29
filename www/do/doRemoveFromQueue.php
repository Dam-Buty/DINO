<?php
session_start();
include("../includes/functions.php");

if ($_SESSION["niveau"] >= 10) {
    
    try {
        $dino = new DINOSQL();
        
        $result = $dino->query("remove_document",[
            "filename" => $_POST["filename"]
        ]);
        
        $dino->commit();
        
        dino_delete($_POST["filename"]);
        
        status(204);
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    status(403);
    dino_log([
        "niveau" => "Z",
        "query" => "Delete document : droits insuffisants"
    ]);
}
?>
