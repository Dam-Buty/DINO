<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    $query = "
        SELECT `filename_document`
        FROM `document` AS `d`, `document_valeur_champ` AS `dvc`
        WHERE 
            `d`.`fk_client` = :dClient
            
            AND `dvc`.`fk_client` = :dvcClient
            AND `dvc`.`fk_monde` = :monde
            AND `dvc`.`fk_champ` = :champ
            AND `dvc`.`fk_valeur_champ` = :pk
            
            AND `d`.`filename_document` = `dvc`.`fk_document`
    ;";
    
    $result = dino_query($query,[
        "dClient" => $_SESSION["client"],
        "dvcClient" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "pk" => $_POST["pk"]
    ]);
    
    if ($result["status"]) {
        status(200);
        $json = count($result["result"]);
        write_log([
            "libelle" => "CHECK avant suppression valeur de champ",
            "admin" => 1,
            "query" => $query,
            "statut" => 0,
            "message" => $json . " documents impactes.",
            "erreur" => "",
            "document" => "",
            "objet" => $_POST["pk"]
        ]);
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
        write_log([
            "libelle" => "CHECK avant suppression valeur de champ",
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
    write_log([
        "libelle" => "CHECK avant suppression valeur de champ",
        "admin" => 1,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["pk"]
    ]);
    header("Location: ../index.php");
}
?>
