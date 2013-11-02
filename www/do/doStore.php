<?php
session_start();
include("../includes/status.php");

if ($_SESSION["niveau"] > 10) {
    include("../includes/mysqli.php");
    
    $query = "UPDATE `document` SET `date_document` = '" . date("Y-m-d H:i:s") . "', `niveau_document` = 0, `fk_operation` = '" . $_POST["operation"] . "' WHERE `filename_document` = '" . $_POST["filename"] . "';
    
        INSERT INTO `type_doc_document` 
        (`fk_type_doc`, `fk_categorie_doc`, `fk_monde`, `fk_client`, `fk_document`, `detail_type_doc_document`, `revision_type_doc_document`) 
        VALUES (" . $_POST["type"] . ", " . $_POST["categorie"] . ", " . $_POST["monde"] . ", " . $_SESSION["client"] . ", '" . $_POST["filename"] . "', '" . $_POST["detail"] . "', (%%TRIGGER%%));";
        
    $query_trigger = "SELECT COALESCE(MAX(`revision_type_doc_document`) + 1, 1) FROM (SELECT `revision_type_doc_document` FROM `type_doc_document` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_categorie_doc` = " . $_POST["categorie"] . " AND `fk_type_doc` = " . $_POST["type"];
    
    foreach($_POST["champs"] as $champ) {
        if ($_POST["cyclique"] == 1) {
            $query_trigger .= " AND (
                SELECT COUNT(*) 
                FROM `operation_valeur_champ` AS `ovc` 
                WHERE `ovc`.`fk_client` = '" . $_SESSION["client"] . "' 
                    AND `ovc`.`fk_monde` = " . $_POST["monde"] . " 
                    AND `ovc`.`fk_operation` = '" . $_POST["operation"] . "' 
                    AND `ovc`.`fk_champ` = " . $champ["pk"] . "
                    AND `ovc`.`fk_valeur_champ` = " . $champ["valeur"] . "
                ) > 0";
        } else {
            $query_trigger .= " AND (
                SELECT COUNT(*) 
                FROM `document_valeur_champ` AS `dvc` 
                WHERE `dvc`.`fk_client` = '" . $_SESSION["client"] . "' 
                    AND `dvc`.`fk_monde` = " . $_POST["monde"] . " 
                    AND `dvc`.`fk_document` = '" . $_POST["filename"] . "' 
                    AND `dvc`.`fk_champ` = " . $champ["pk"] . "
                    AND `dvc`.`fk_valeur_champ` = " . $champ["valeur"] . "
                ) > 0";
        }           
    }
    
    $query_trigger .= ") AS `magic_revision`";
    
    $query = str_replace('%%TRIGGER%%', $query_trigger, $query);
    
    if ($_POST["cyclique"] == 1) {
        if ($_POST["isnew"] == 1) {
            $query .= "INSERT INTO `operation` (`pk_operation`, `date_operation`, `fk_monde`, `fk_client`, `fk_user`) VALUES ('" . $_POST["operation"] . "', '" . date("Y-m-d H:i:s") . "', " . $_POST["monde"] . ", " . $_SESSION["client"] . ", '" . $_SESSION["user"] . "');";
            
            foreach($_POST["champs"] as $champ) {
                $query .= "INSERT INTO `operation_valeur_champ` (`fk_operation`, `fk_monde`, `fk_client`, `fk_valeur_champ`, `fk_champ`) VALUES ('" . $_POST["operation"] . "', " . $_POST["monde"] . ", " . $_SESSION["client"] . ", " . $champ["valeur"] . ", " . $champ["pk"] . ");";
            }
        }
    } else {
        foreach($_POST["champs"] as $champ) {
            $query .= "INSERT INTO `document_valeur_champ` (`fk_document`, `fk_monde`, `fk_client`, `fk_valeur_champ`, `fk_champ`) VALUES ('" . $_POST["filename"] . "', " . $_POST["monde"] . ", " . $_SESSION["client"] . ", " . $champ["valeur"] . ", " . $champ["pk"] . ");";
        }
    }
    
    if ($mysqli->multi_query($query)) {
        $i = 0; 
        do { 
            $i++; 
        } while ($mysqli->next_result()); 
        
        if (!$mysqli->errno) { 
            status(200);
            $json = '{ "query": "' . $query . '" }';
        } else {
            status(500);
            $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
        }
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
