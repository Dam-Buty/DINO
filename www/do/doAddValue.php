<?php
session_start();
include("../includes/log2.php");

if ($_SESSION["niveau"] >= 10) {  
    include("../includes/PDO2.php");
    include("../includes/status.php"); 
    
    $result = dino_query("insert_valeur_champ", [
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "parent" => $_POST["parent"],
        "valeur" => $_POST["valeur"]
    ]);
        
    if ($result["status"]) {
        status(200);
        
        header('Content-Type: application/json');
        echo json_encode([
            "pk" => $result["result"]
        ]);
    } else {
        status(500);
    }
} else {
    status(403);
}

?>
