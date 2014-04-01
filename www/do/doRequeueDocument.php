<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 10) {
    include("../includes/PDO.php");
    include("../includes/status.php");
            
    $result_document = dino_query("requeue_document",[
        "client" => $_SESSION["client"],
        "filename" => $_POST["filename"]
    ]);
    
    if ($result_document["status"]) { 
            
        $result_type = dino_query("requeue_types",[
            "client" => $_SESSION["client"],
            "filename" => $_POST["filename"]
        ]);
        
        if ($result_type["status"]) {
                     
            $result_valeur = dino_query("requeue_valeurs",[
                "client" => $_SESSION["client"],
                "filename" => $_POST["filename"]
            ]);   
            
            if ($result_valeur["status"]) {
                status(200);
            } else {
                status(500);
            }
        } else {
            status(500);
        }
    } else {
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
