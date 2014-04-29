<?php
session_start();
include("../includes/functions.php");

if ($_SESSION["niveau"] >= 10) {  
    
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
        $dino->rollback();
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
