<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php");
    
    $params = [
        "categorie" => $_POST["label"],
        "niveau" => $_POST["niveau"],
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"]
    ];
    
    if ($_POST["pk"] == "new") {
        $query = "categorie_add";
        
        $params["time"] = $_POST["time"];
    } else {
        $query = "categorie_change";
        
        $params["pk"] = $_POST["pk"];
    }
    
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        status(200);
        
        if ($_POST["pk"] == "new") {
            $objet = $result["result"];
        } else {
            $objet = $_POST["pk"];
        }
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Sauvegarde catégorie : droits insuffisants"
    ]);
    header("Location: ../index.php");
}
?>
