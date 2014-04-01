<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php");  
        
    $params = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "parent" => $_POST["parent"],
        "champ" => $_POST["champ"]
    ];
    
    $result = dino_query("json_champs", $params);
    
    if ($result["status"]) {
        
        $valeurs = [];
        
        foreach($result["result"] as $row) {
            $valeurs[$row["pk_valeur_champ"]] = $row["label_valeur_champ"];
        }
        
        $json = json_encode($valeurs);
        status(200);
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "JSON champs : droits insuffisants"
    ]);
    status(403);
}
?>
