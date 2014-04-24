<?php
session_start();
include("../includes/log.php");

if ($_SESSION["niveau"] >= 10) {  
    include("../includes/DINOSQL.php");
    include("../includes/status.php"); 
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "client" => $_SESSION["client"],
            "monde" => $_POST["monde"],
            "champ" => $_POST["champ"],
            "parent" => $_POST["parent"],
            "valeur" => $_POST["valeur"]
        ];
        
        $result = $dino->query("insert_valeur_champ", $params);    
        $dino->commit();
        
        status(200);     
        echo $result;
    } catch (Exception $e) {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Add valeur : droits insuffisants"
    ]);
    status(403);
}

?>
