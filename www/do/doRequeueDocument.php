<?php
session_start();
include("../includes/log.php");
include("../includes/status.php");

if ($_SESSION["niveau"] >= 10) {
    include("../includes/DINOSQL.php");
    
    try {
        $dino = new DINOSQL();
           
        $dino->query("requeue_document",[
            "client" => $_SESSION["client"],
            "filename" => $_POST["filename"]
        ]);
                
        $dino->query("requeue_types",[
            "client" => $_SESSION["client"],
            "filename" => $_POST["filename"]
        ]);
                 
        $dino->query("requeue_valeurs",[
            "client" => $_SESSION["client"],
            "filename" => $_POST["filename"]
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
        "query" => "Requeue document : droits insuffisants"
    ]);
    status(403);
}
?>
