<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php");
    
    $params = [
        "label" => $_POST["label"],
        "champ" => $_POST["champ"],
        "monde" => $_POST["monde"],
        "client" => $_SESSION["client"],
        "parent" => $_POST["parent"]
    ];
    
    if ($_POST["pk"] == "new") {
        $query = "
            INSERT INTO `valeur_champ` (
                `label_valeur_champ`, 
                `fk_champ`, 
                `fk_monde`, 
                `fk_client`, 
                `fk_parent`
            ) VALUES (
                :label,
                :champ,
                :monde,
                :client,
                :parent
            )
        ;";
    } else {
        $query = "
            UPDATE `valeur_champ`
            SET 
                `label_valeur_champ` = :label
            WHERE
                `fk_client` = :client
                AND `fk_monde` = :monde
                AND `fk_champ` = :champ
                AND `fk_parent` = :parent
                AND `pk_valeur_champ` = :pk
        ;";
        
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
        
        write_log([
            "libelle" => "INSERT valeur",
            "admin" => 1,
            "query" => $query,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $objet
        ]);
    } else {
        status(500);
        write_log([
            "libelle" => "INSERT valeur",
            "admin" => 1,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_POST["pk"]
        ]);
    }
    
} else {
    status(403);
    write_log([
        "libelle" => "INSERT valeur",
        "admin" => 1,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["pk"]
    ]);
}
?>
