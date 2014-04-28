<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] == 999) {
    include("../includes/DINOSQL.php");
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "client" => $_POST["client"],
            "produit" => $_POST["produit"],
            "qte" => $_POST["qte"],
            "mois" => $_POST["mois"]
        ];
        
        $dino->query("superadmin_give_token", $params);
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Petit pédé se prend pour un superadmin!"
    ]);
    status(403);
}
?>
