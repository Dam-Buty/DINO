<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php");
    
    $params = [
        "client" => $_POST["client"],
        "produit" => $_POST["produit"],
        "qte" => $_POST["qte"],
        "mois" => $_POST["mois"]
    ];
    
    $result = dino_query("superadmin_give_token", $params);
    
    if ($result["status"]) {
        status(200);
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Petit pédé se prend pour un superadmin!"
    ]);
    header("Location: ../index.php");
}
?>
