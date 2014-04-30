<?php
session_start();
include("../includes/functions.php");

if ($_SESSION["niveau"] >= 10) {
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "label" => $_POST["label"],
            "monde" => $_POST["monde"],
            "client" => $_SESSION["client"],
            "pk" => $_POST["pk"]
        ];
        
        $query = "valeur_change";
        
        $dino->query($query, $params);
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Save valeur : droits insuffisants"
    ]);
    status(403);
}
?>
