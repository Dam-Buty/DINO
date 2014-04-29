<?php
session_start();
include("../includes/functions.php"); 

if (isset($_SESSION["niveau"])) {
    
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
