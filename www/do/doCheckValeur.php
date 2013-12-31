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
            `d`.`fk_client` = " . $_SESSION["client"] . "
            
            AND `dvc`.`fk_client` = " . $_SESSION["client"] . "
            AND `dvc`.`fk_monde` = " . $_POST["monde"] . "
            AND `dvc`.`fk_champ` = " . $_POST["champ"] . "
            AND `dvc`.`fk_valeur_champ` = " . $_POST["pk"] . "
            
            AND `d`.`filename_document` = `dvc`.`fk_document`
    ;";
    if ($res = $mysqli->query($query)) {
        status(200);
        $json = $res->num_rows;
        write_log([
            "libelle" => "CHECK avant suppression valeur de champ",
            "admin" => 1,
            "query" => $query,
            "statut" => 0,
            "message" => $res->num_rows . " documents impactes.",
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
            "message" => "",
            "erreur" => $mysqli->error,
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
