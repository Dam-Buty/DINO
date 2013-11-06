<?php
session_start();
include("../includes/status.php");

if ($_SESSION["niveau"] > 10) {
    include("../includes/mysqli.php");
    
    if ($_POST["pkope"] == "") {
        $pk_ope = 0;
    } else {
        $pk_ope = $_POST["pkope"];
    }
    
    if ($_POST["cyclique"] == 1) {
        // On crée d'abord l'opération si nécessaire
        $err = 0;
        
        if ($_POST["isnew"] == 1) {
            $query_ope = "INSERT INTO `operation` (`ref_operation`, `date_operation`, `fk_monde`, `fk_client`, `fk_user`) VALUES ('" . $_POST["refope"] . "', '" . date("Y-m-d H:i:s") . "', " . $_POST["monde"] . ", " . $_SESSION["client"] . ", '" . $_SESSION["user"] . "');";
            
            if ($mysqli->query($query_ope)) {
                $pk_ope = $mysqli->insert_id;
            
                foreach($_POST["champs"] as $pk => $valeur) {
                    $query .= "INSERT INTO `operation_valeur_champ` (`fk_operation`, `fk_monde`, `fk_client`, `fk_valeur_champ`, `fk_champ`) VALUES (" . $pk_ope . ", " . $_POST["monde"] . ", " . $_SESSION["client"] . ", " . $valeur . ", " . $pk . ");";
                }
            }
        }
    } else {
        foreach($_POST["champs"] as $pk => $valeur) {
            $query .= "INSERT INTO `document_valeur_champ` (`fk_document`, `fk_monde`, `fk_client`, `fk_valeur_champ`, `fk_champ`) VALUES ('" . $_POST["filename"] . "', " . $_POST["monde"] . ", " . $_SESSION["client"] . ", " . $valeur . ", " . $pk . ");";
        }
    }
    
    $query .= "UPDATE `document` SET `date_document` = '" . date("Y-m-d H:i:s") . "', `niveau_document` = 10, `fk_operation` = " . $pk_ope . ", `fk_monde` = " . $_POST["monde"] . " WHERE `filename_document` = '" . $_POST["filename"] . "';                
        INSERT INTO `type_doc_document` 
        (`fk_type_doc`, `fk_categorie_doc`, `fk_monde`, `fk_client`, `fk_document`, `detail_type_doc_document`, `revision_type_doc_document`) 
        VALUES (" . $_POST["type"] . ", " . $_POST["categorie"] . ", " . $_POST["monde"] . ", " . $_SESSION["client"] . ", '" . $_POST["filename"] . "', '" . $_POST["detail"] . "', (%%TRIGGER%%));";
              

    if ($_POST["cyclique"] == 1 && $_POST["isnew"] == 0) {   
        $query_trigger = "SELECT COALESCE(MAX(`revision_type_doc_document`) + 1, 1) FROM (SELECT `revision_type_doc_document` FROM `type_doc_document` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_categorie_doc` = " . $_POST["categorie"] . " AND `fk_type_doc` = " . $_POST["type"];
        
        foreach($_POST["champs"] as $pk => $valeur) {
            $query_trigger .= " AND (
                SELECT COUNT(*) 
                FROM `operation_valeur_champ` AS `ovc` 
                WHERE `ovc`.`fk_client` = '" . $_SESSION["client"] . "' 
                    AND `ovc`.`fk_monde` = " . $_POST["monde"] . " 
                    AND `ovc`.`fk_operation` = " . $_POST["pkope"] . " 
                    AND `ovc`.`fk_champ` = " . $pk . "
                    AND `ovc`.`fk_valeur_champ` = " . $valeur . "
                ) > 0";
        }
        $query_trigger .= ") AS `magic_revision`";
    } else {
        if ($_POST["cyclique"] == 0) {
            $query_trigger = "SELECT COALESCE(MAX(`revision_type_doc_document`) + 1, 1) FROM (SELECT `revision_type_doc_document` FROM `type_doc_document` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_categorie_doc` = " . $_POST["categorie"] . " AND `fk_type_doc` = " . $_POST["type"];
            foreach($_POST["champs"] as $pk => $valeur) {
                $query_trigger .= " AND (
                    SELECT COUNT(*) 
                    FROM `document_valeur_champ` AS `dvc` 
                    WHERE `dvc`.`fk_client` = '" . $_SESSION["client"] . "' 
                        AND `dvc`.`fk_monde` = " . $_POST["monde"] . " 
                        AND `dvc`.`fk_document` = '" . $_POST["filename"] . "' 
                        AND `dvc`.`fk_champ` = " . $pk . "
                        AND `dvc`.`fk_valeur_champ` = " . $valeur . "
                    ) > 0";
            }
            $query_trigger .= ") AS `magic_revision`";
        }
    }
                    
    if ($query_trigger == "") {
        $query_trigger = "1";
    }            
            
    $query = str_replace('%%TRIGGER%%', $query_trigger, $query);
                
                
    if ($mysqli->multi_query($query)) {
        $i = 0; 
        do { 
            $i++; 
        } while ($mysqli->next_result()); 
        
        if (!$mysqli->errno) { 
            status(200);
            $json = '{ "query2": "' . $query . '" }';
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
