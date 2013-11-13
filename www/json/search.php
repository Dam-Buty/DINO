<?php
session_start();
include("../includes/status.php");

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    
    $liste = [];
    
    $query = "
        SELECT 
            `d`.`filename_document`, 
            `d`.`date_document`,
            `ca`.`pk_categorie_doc`,
            `ca`.`label_categorie_doc`,
            `td`.`pk_type_doc`,
            `td`.`label_type_doc`,
            `tdd`.`detail_type_doc_document`,
            `tdd`.`revision_type_doc_document`
        FROM 
            `categorie` AS `ca`,
            `type_doc` AS `td`,
            `type_doc_document` AS `tdd`,
            `document` AS `d`,
            CONCAT_WS('||'";
    // On concatène les valeurs de champs pour tout faire en une passe        
    foreach($_POST["champ"] as $champ => $donnees) {
        $query .= "
                , (
                SELECT CONCAT_WS('%%', `label_valeur_champ`, `pk_valeur_champ`)
                FROM 
                    `valeur_champ` AS `vc`,
                    `document_valeur_champ` AS `dvc`
                WHERE 
                    `dvc`.`fk_client` = " . $_SESSION["client"] . "
                    AND `dvc`.`fk_monde` = " . $_POST["monde"] . "
                    AND `vc`.`fk_client` = " . $_SESSION["client"] . "
                    AND `vc`.`fk_monde` = " . $_POST["monde"] . "
                    
                    AND `vc`.`fk_champ` = `dvc`.`fk_champ`
                    AND `vc`.`pk_valeur_champ` = `dvc`.`fk_valeur_champ`
                    
                    AND `dvc`.`fk_document` = `d`.`filename_document`
                    
                    AND `dvc`.`fk_champ` = " . $donnees["pk"] . "
                )"; 
   }  
   $query .=") AS `champs`
        WHERE
            `ca`.`fk_client` = " . $_SESSION["client"] . "
            AND `ca`.`fk_monde` = " . $_POST["monde"] . "
            AND `td`.`fk_client` = " . $_SESSION["client"] . "
            AND `td`.`fk_monde` = " . $_POST["monde"] . "
            AND `tdd`.`fk_client` = " . $_SESSION["client"] . "
            AND `tdd`.`fk_monde` = " . $_POST["monde"] . "
            AND `d`.`fk_client` = " . $_SESSION["client"] . "
            AND `d`.`fk_monde` = " . $_POST["monde"] . "
            
            AND `ca`.`fk_champ` = `td`.`fk_champ`
            AND `ca`.`pk_categorie` = `td`.`fk_categorie`
            
            AND `td`.`fk_champ` = `tdd`.`fk_champ`
            AND `td`.`pk_categorie` = `tdd`.`fk_categorie`
            AND `td`.`pk_type_doc` = `tdd`.`fk_type_doc`
            
            AND `tdd`.`fk_document` = `d`.`filename_document`
            
            AND `niveau_document` <= " . $_SESSION["niveau"] . " 
            
            AND `tdd`.`revision_type_doc_document` = (
                SELECT MAX(`revision_type_doc_document`)
                FROM `type_doc_document` AS `tdd2`
                WHERE 
                    `tdd2`.`fk_client` = " . $_SESSION["client"] . "
                    AND `tdd2`.`fk_monde` = " . $_POST["monde"] . "
                    AND `tdd2`.`fk_document` = `d`.`filename_document`
            )
        ORDER BY ";
foreach($_POST["champ"] as $champ => $donnees) {
    if ($donnees["tri"] == 1) {
        $sens = "ASC";
    } else {
        $sens = "DESC";
    }
    $query .= "(
            SELECT `label_valeur_champ`
            FROM 
                `valeur_champ` AS `vc`,
                `document_valeur_champ` AS `dvc`
            WHERE 
                `dvc`.`fk_client` = " . $_SESSION["client"] . "
                AND `dvc`.`fk_monde` = " . $_POST["monde"] . "
                AND `vc`.`fk_client` = " . $_SESSION["client"] . "
                AND `vc`.`fk_monde` = " . $_POST["monde"] . "
                
                AND `vc`.`fk_champ` = `dvc`.`fk_champ`
                AND `vc`.`pk_valeur_champ` = `dvc`.`fk_valeur_champ`
                
                AND `dvc`.`fk_document` = `d`.`filename_document`
                
                AND `dvc`.`fk_champ` = " . $donnees["pk"] . "
        ) " . $sens . ", ";
}
$query .= "(
               SELECT COUNT(*) 
               FROM `document_valeur_champ` AS `dvc2`
               WHERE 
                  `dvc2`.`fk_client` = " . $_SESSION["client"] . "
                  AND `dvc2`.`fk_monde` = " . $_POST["monde"] . "
                  AND `dvc2`.`fk_document` = `d`.`filename_document`
           ) ASC, `ca`.`label_categorie_doc` ASC, `td`.`label_type_doc` ASC
            
        LIMIT " . $_POST["limite"][0] . ", " . $_POST["limite"][1] . "         
    ;";
    
    if ($result = $mysqli->query($query)) {        
        while ($row = $result->fetch_assoc()) {
            // TODO : Ici on gère les groupings
        }
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query_docs . '", "message": "' . $mysqli->error . '" }';
    }
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
