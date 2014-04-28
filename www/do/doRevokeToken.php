<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] == 999) {
    include("../includes/DINOSQL.php");
    
    try {
        $dino = new DINOSQL();
        
        $dino->query("superadmin_revoke_token", [
            "pk" => $_POST["pk"]
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
        "query" => "Petit pédé se prend pour un superadmin!"
    ]);
    status(403);
}
?>
