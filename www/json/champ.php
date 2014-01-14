<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");  
    
    $query = "
        SELECT 
            `pk_valeur_champ`, 
            `label_valeur_champ` 
        FROM `valeur_champ` 
        WHERE 
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_parent` = :parent
            AND `fk_champ` = :champ
        ;";
        
    $params = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "parent" => $_POST["parent"],
        "champ" => $_POST["champ"]
    ];
    
    $result = dino_query($query, $params);
    
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
        write_log([
            "libelle" => "GET valeurs de champ",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_POST["champ"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "GET valeurs de champ",
        "admin" => 0,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["champ"]
    ]);
}
?>
