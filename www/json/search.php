<?php
session_start();
include("../includes/status.php");

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    
    $query = "
        SELECT 
            `filename_document`, 
            `date_document`
        FROM 
            `categorie` AS `ca`,
            `type_doc` AS `td`,
            `type_doc_document` AS `tdd`,
            `document` AS `d`,
            CONCAT_WS('||'";
            
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
   $query .=")
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
    ";
    
    
    if ($_POST["cyclique"] == 1) {
        $query = "SELECT `pk_operation`, `ref_operation`, `date_operation`, `fk_user` 
                FROM `operation` 
                WHERE 
                    `fk_client` = " . $_SESSION["client"] . " 
                    AND `fk_monde` = " . $_POST["monde"] . ";";
        
        if ($result = $mysqli->query($query)) {
            $json = "[ ";
            
            while ($row = $result->fetch_assoc()) {
                if ($json != "[ ") {
                    $json .= ', ';
                }
                
                $json .= '{ "pk": "' . $row["pk_operation"] . '", "ref": "' . $row["ref_operation"] . '", "date": "' . $row["date_operation"] . '", "user": "' . $row["fk_user"] . '", "champs": "%%CHAMPS%%", "documents": "%%DOCUMENTS%%" }';
                
                ////////////////////////////////////////
                // Récupération des champs d'opération
                $query_champs = "
                    SELECT `fk_valeur_champ`, `fk_champ` 
                        FROM 
                            `operation_valeur_champ`
                        WHERE 
                            `fk_operation` = " . $row["pk_operation"] . "
                ;";
                
                if ($result_champs = $mysqli->query($query_champs)) {
                    $json_champs = "{ ";
                    
                    while ($row_champs = $result_champs->fetch_assoc()) {
                        if ($json_champs != "{ ") {
                            $json_champs .= ', ';
                        }
                        
                        $json_champs .= '"' . $row_champs["fk_champ"] . '": "' . $row_champs["fk_valeur_champ"] . '"';
                    }                
                } else {
                    status(500);
                    $json = '{ "error": "mysqli", "query": "' . $query_champs . '", "message": "' . $mysqli->error . '" }';
                }
                
                $json_champs .= " }";   
                
                $json = str_replace('"%%CHAMPS%%"', $json_champs, $json);
                
                //////////////////////////////////////////////////////
                // Récupération des documents
                
                $query_docs = "
                    SELECT 
                        `filename_document`, 
                        `date_document`, 
                        `fk_user`, 
                        `fk_categorie_doc`, 
                        `fk_type_doc`, 
                        `detail_type_doc_document`, 
                        `revision_type_doc_document` 
                    FROM `document`, `type_doc_document` 
                    WHERE 
                        `fk_document` = `filename_document` 
                        AND `document`.`fk_client` = " . $_SESSION["client"] . "
                        AND `type_doc_document`.`fk_client` = " . $_SESSION["client"] . "
                        AND `document`.`fk_monde` = " . $_POST["monde"] . " 
                        AND `type_doc_document`.`fk_monde` = " . $_POST["monde"] . " 
                        AND `fk_operation` = " . $row["pk_operation"] . " 
                    ORDER BY 
                        `fk_categorie_doc` ASC, 
                        `fk_type_doc` ASC, 
                        `detail_type_doc_document` ASC, 
                        `revision_type_doc_document` DESC
                ";
                
                if ($result_docs = $mysqli->query($query_docs)) {
                    $json_docs = "[ ";
                    $json_revisions = "{ ";
                    $json_doc = "";
                    $oldCategorie = "";
                    $oldType = "";
                    $oldDetail = "";
                    
                    while ($row_docs = $result_docs->fetch_assoc()) {
                        // On n'est plus dans une révision d'un doc précédent
                        if ($row_docs["fk_categorie_doc"] != $oldCategorie || $row_docs["fk_type_doc"] != $oldType || $row_docs["detail_type_doc_document"] != $oldDetail) {
                            // Si on n'est pas dans le premier document
                            // on merge les révisions et on ajoute le document
                            // à json_docs
                            if ($json_doc != "") {
                                $json_revisions .= " }";
                                $json_doc = str_replace('"%%REVISIONS%%"', $json_revisions, $json_doc);
                                
                                if ($json_docs != "[ ") {
                                    $json_docs .= ", ";
                                }
                                
                                $json_docs .= $json_doc;
                            }
                            
                            // on construit le nouveau json_doc et les
                            // variables old 
                            $json_doc = '{ "filename": "' . $row_docs["filename_document"] . '", "date": "' . $row_docs["date_document"] . '", "user": "' . $row_docs["fk_user"] . '", "categorie": "' . $row_docs["fk_categorie_doc"] . '", "type": "' . $row_docs["fk_type_doc"] . '", "detail": "' . $row_docs["detail_type_doc_document"] . '", "revision": "' . $row_docs["revision_type_doc_document"] . '", "revisions": "%%REVISIONS%%" }';
                            
                            $oldCategorie = $row_docs["fk_categorie_doc"];
                            $oldType = $row_docs["fk_type_doc"];
                            $oldDetail = $row_docs["detail_type_doc_document"];
                        } else {
                            // on est dans une révision du doc précédent
                            // on alimente le nouveau doc dans
                            // json_revisions
                            if ($json_revisions != "{ ") {
                                $json_revisions .= ", ";
                            }
                            
                            $json_revisions .= '"' . $row_docs["revision_type_doc_document"] . '": { "filename": "' . $row_docs["filename_document"] . '", "date": "' . $row_docs["date_document"] . '", "user": "' . $row_docs["fk_user"] . '" }';
                        }
                    }   
                    
                    // On enregistre le dernier doc + révision
                    // qui n'a pas eu droit à son tour
                    $json_revisions .= " }";
                    $json_doc = str_replace('"%%REVISIONS%%"', $json_revisions, $json_doc);
                    
                    if ($json_docs != "[ ") {
                        $json_docs .= ", ";
                    }
                    
                    $json_docs .= $json_doc;
                    
                    // On ferme le json_docs et on se casse
                    $json_docs .= " ]";        
                    
                    $json = str_replace('"%%DOCUMENTS%%"', $json_docs, $json);
                } else {
                    status(500);
                    $json = '{ "error": "mysqli", "query": "' . $query_docs . '", "message": "' . $mysqli->error . '" }';
                }
            }
            $json .= ' ]';
            //$json .= ' , { "query": "' . $query . '", "query_champs": "' . $query_champs . '", "query_docs": "' . $query_docs . '" }}';
        }
    } else {
        echo "Pas pret";
    }
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
