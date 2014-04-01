<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php"); 
        
    $params = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"]
    ];
    
    $result = dino_query("json_dates", $params);
    
    if ($result["status"]) {
        
        $dates = [];
        
        $row = $result["result"][0];
        
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
    } else {
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
