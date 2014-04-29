<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/DINOSQL.php"); 
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "monde" => $_POST["monde"]
        ];
        
        $result = $dino->query("count_documents", $params);
        
        $row = $result[0];
        
        $json = json_encode([
            "docs" => $row["docs"],
            "space" => $row["space"]
        ]);
        
        status(200);
        header('Content-Type: application/json');
        echo $json;
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
