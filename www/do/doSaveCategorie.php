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
        $query = "
            INSERT INTO `categorie_doc` (
                `label_categorie_doc`, 
                `niveau_categorie_doc`,
                `time_categorie_doc`,
                `fk_champ`, 
                `fk_monde`, 
                `fk_client`
            ) VALUES (
                :categorie,
                :niveau,
                :time,
                :champ,
                :monde,
                :client
            )
        ;";
        
        $params["time"] = $_POST["time"];
    } else {
        $query = "
            UPDATE `categorie_doc`
            SET 
                `label_categorie_doc` = :categorie,
                `niveau_categorie_doc` = :niveau
            WHERE
                `fk_client` = :client
                AND `fk_monde` = :monde
                AND `fk_champ` = :champ
                AND `pk_categorie_doc` = :pk
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
            "libelle" => "INSERT categorie",
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
            "libelle" => "INSERT categorie",
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
    header("Location: ../index.php");
    write_log([
        "libelle" => "INSERT categorie",
        "admin" => 1,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["pk"]
    ]);
}
?>
