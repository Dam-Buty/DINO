<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
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
                    $json_champs = "[ ";
                    
                    while ($row_champs = $result_champs->fetch_assoc()) {
                        if ($json_champs != "[ ") {
                            $json_champs .= ', ';
                        }
                        
                        $json_champs .= '{ "champ": "' . $row_champs["fk_champ"] . '", "valeur": "' . $row_champs["fk_valeur_champ"] . '" }';
                    }                
                } else {
                    status(500);
                    $json = '{ "error": "mysqli", "query": "' . $query_champs . '", "message": "' . $mysqli->error . '" }';
                }
                
                $json_champs .= " ]";   
                
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
                        `revision_type_doc_document` ASC
                ";
                
                if ($result_docs = $mysqli->query($query_docs)) {
                    $json_docs = "[ ";
                    
                    while ($row_docs = $result_docs->fetch_assoc()) {
                        if ($json_docs != "[ ") {
                            $json_docs .= ', ';
                        }
                        
                        $json_docs .= '{ "filename": "' . $row_docs["filename_document"] . '", "date": "' . $row_docs["date_document"] . '", "user": "' . $row_docs["fk_user"] . '", "categorie": "' . $row_docs["fk_categorie_doc"] . '", "type": "' . $row_docs["fk_type_doc"] . '", "detail": "' . $row_docs["detail_type_doc_document"] . '", "revision": "' . $row_docs["revision_type_doc_document"] . '" }';
                    }   
                    
                    $json_docs .= " ]";        
                    
                    $json = str_replace('"%%DOCUMENTS%%"', $json_docs, $json);
                } else {
                    status(500);
                    $json = '{ "error": "mysqli", "query": "' . $query_docs . '", "message": "' . $mysqli->error . '" }';
                }
            }
            $json .= ' ]';
            //$json .= ' , { "query": "' . $query . '", "query_champs": "' . $query_champs . '", "query_docs": "' . $query_docs . '" }]';
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
