<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    
    $params = [
        "label" => $_POST["label"],
        "niveau" => $_POST["niveau"],
        "detail" => $_POST["detail"],
        "categorie" => $_POST["categorie"],
        "champ" => $_POST["champ"],
        "monde" => $_POST["monde"],
        "client" => $_SESSION["client"],
    ];
    
    if ($_POST["pk"] == "new") {
        $query = "
            INSERT INTO `type_doc` (
                `label_type_doc`, 
                `niveau_type_doc`,
                `detail_type_doc`,
                `fk_categorie_doc`,
                `fk_champ`, 
                `fk_monde`, 
                `fk_client`
            ) VALUES (
                :label,
                :niveau,
                :detail,
                :categorie,
                :champ,
                :monde,
                :client
            )
        ;";
    } else {
        $query = "
            UPDATE `type_doc`
            SET 
                `label_type_doc` = :label,
                `niveau_type_doc` = :niveau,
                `detail_type_doc` = :detail
            WHERE
                `fk_client` = :client
                AND `fk_monde` = :monde
                AND `fk_champ` = :champ
                AND `fk_categorie_doc` = :categorie
                AND `pk_type_doc` = :pk
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
            "libelle" => "INSERT type",
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
            "libelle" => "INSERT type",
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
        "libelle" => "INSERT type",
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
