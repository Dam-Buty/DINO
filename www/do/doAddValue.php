<?php
session_start();
include("../includes/log.php");

if ($_SESSION["niveau"] >= 10) {
    include("../includes/PDO.php");
    include("../includes/status.php");    
    
    $query = "
        INSERT INTO `valeur_champ`
        (`fk_client`, `fk_monde`, `fk_champ`, `fk_parent`, `label_valeur_champ`)
        VALUES (
            :client, 
            :monde, 
            :champ, 
            :parent, 
            :valeur
    );";
    
    $result = dino_query($query,[
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "parent" => $_POST["parent"],
        "valeur" => $_POST["valeur"]
    ]);
        
    if ($result["status"]) {
        status(200);
        
        write_log([
            "libelle" => "INSERT valeur de champ",
            "admin" => 0,
            "query" => $query,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $result["result"],
            "mysqli" => $mysqli
        ]);
        
        header('Content-Type: application/json');
        echo json_encode([
            "pk" => $result["result"]
        ]);
    } else {
        status(500);
        write_log([
            "libelle" => "INSERT valeur de champ",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => 0,
            "mysqli" => $mysqli
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "INSERT valeur de champ",
        "admin" => 0,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => 0,
        "mysqli" => $mysqli
    ]);
}

?>
