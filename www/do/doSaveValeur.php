<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 20) {
    include("../includes/DINOSQL.php");
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "label" => $_POST["label"],
            "champ" => $_POST["champ"],
            "monde" => $_POST["monde"],
            "client" => $_SESSION["client"],
            "parent" => $_POST["parent"]
        ];
        
        if ($_POST["pk"] == "new") {
            $query = "valeur_add";
        } else {
            $query = "valeur_change";
            
            $params["pk"] = $_POST["pk"];
        }
        
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
