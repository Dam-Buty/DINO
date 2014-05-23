<?php
session_start();
include("../includes/functions.php"); 

if (isset($_SESSION["niveau"])) {
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "client" => $_SESSION["client"]
        ];
        
        $result = $dino->query("first_store", $params);
        $dino->commit();
        status(200);
    } catch (Exception $e) {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "JSON dates : droits insuffisants"
    ]);
    status(403);
}
?>
