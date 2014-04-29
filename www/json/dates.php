<?php
session_start();
include("../includes/functions.php");  

if (isset($_SESSION["niveau"])) {
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "client" => $_SESSION["client"],
            "monde" => $_POST["monde"]
        ];
        
        $result = $dino->query("json_dates", $params);
            
        $dates = [];
        
        $row = $result[0];
        
        $dates["mini"] = $row["min"];
        $dates["maxi"] = $row["max"];
        
        if ($dates["mini"] == null) {
            $dates["mini"] = date("Y-m-d");
        }
        
        if ($dates["maxi"] == null) {
            $dates["maxi"] = date("Y-m-d");
        }
        
        $json = json_encode($dates);
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
