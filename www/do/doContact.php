<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 20) {
    include("../includes/DINOSQL.php");
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "client" => $_SESSION["client"]
        ];
        
        $dino->query("contact", $params);
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
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
