<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

$champs = array_filter($_POST["champs"]);

if ($_SESSION["niveau"] >= 10) {
    include("../includes/mysqli.php");
    
    $query = "
        SELECT `revision_type_doc` 
        FROM `type_doc_document` AS `tdd`
        WHERE `tdd`.`fk_client` = " . $_SESSION["client"] . " 
            AND `tdd`.`fk_monde` = " . $_POST["monde"] . " 
            AND `tdd`.`fk_categorie_doc` = " . $_POST["categorie"] . " 
            AND `tdd`.`fk_type_doc` = " . $_POST["type"] . " 
            AND `tdd`.`detail_type_doc` = '" . $_POST["detail"] . "'
            
    ";
            
            foreach($champs as $pk => $valeur) {
                $query .= " 
            AND (
                SELECT COUNT(*) 
                FROM `document_valeur_champ` AS `dvc` 
                WHERE `dvc`.`fk_client` = '" . $_SESSION["client"] . "' 
                    AND `dvc`.`fk_monde` = " . $_POST["monde"] . " 
                    AND `dvc`.`fk_champ` = " . $pk . "
                    AND `dvc`.`fk_valeur_champ` = " . $valeur . "
                    AND `dvc`.`fk_document` = `tdd`.`fk_document`
                ) > 0";
            }
    $query .= "
        ;";      
                             
    if ($res = $mysqli->query($query)) {
        if ($res->num_rows != 0) {
            status(200);
        } else {
            status(204);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "CHECK revision",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $_POST["filename"]
        ]);
    }    
} else {
    status(403);
    write_log([
        "libelle" => "CHECK revision",
        "admin" => 0,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["filename"]
    ]);
}
?>
