<?php
session_start();
include("../includes/status.php");

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    
    $liste = [];
    
    $query = "
        SELECT 
            `d`.`filename_document` AS `filename`, 
            DATE_FORMAT(`d`.`date_document`, '%d/%m/%Y') AS `date`,
            `td`.`fk_categorie_doc` AS `categorie`,
            `td`.`pk_type_doc` AS `type`,
            `tdd`.`detail_type_doc` AS `detail`,
            `tdd`.`revision_type_doc` AS `revision`,
            (
                SELECT `pk_categorie_doc`
                FROM `categorie_doc` AS `cd`
                WHERE 
                    `cd`.`fk_client` = " . $_SESSION["client"] . "
                    AND `cd`.`fk_monde` = " . $_POST["monde"] . "
                    AND `cd`.`pk_categorie_doc` = `td`.`fk_categorie_doc`
           ) AS `categorie`,
            ( SELECT GROUP_CONCAT( `pk_valeur_champ` SEPARATOR '||')
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
            ORDER BY `vc`.`fk_champ`
            ) AS `champs`
        FROM 
            `type_doc` AS `td`,
            `type_doc_document` AS `tdd`,
            `document` AS `d`
        WHERE
            # Filtre client/monde
            `td`.`fk_client` = " . $_SESSION["client"] . "
            AND `td`.`fk_monde` = " . $_POST["monde"] . "
            AND `tdd`.`fk_client` = " . $_SESSION["client"] . "
            AND `tdd`.`fk_monde` = " . $_POST["monde"] . "
            AND `d`.`fk_client` = " . $_SESSION["client"] . "
            
            # Jointures
            AND `td`.`fk_champ` = `tdd`.`fk_champ`
            AND `td`.`fk_categorie_doc` = `tdd`.`fk_categorie_doc`
            AND `td`.`pk_type_doc` = `tdd`.`fk_type_doc`
            
            AND `tdd`.`fk_document` = `d`.`filename_document`
            
            AND `niveau_document` <= " . $_SESSION["niveau"];
            
if (isset($_POST["recherche"])) {
            
 $query .= "# Recherche
            AND ( ";
            
    $first = 1;
    foreach($_POST["recherche"] as $i => $terme) {
        if ($first) {
            $first = 0;
        } else {
            $query .= " OR ";
        }
        
        $query .= "(
                    SELECT COUNT(*)
                    FROM `document_valeur_champ` AS `dvc_search`
                    WHERE
                        `dvc_search`.`fk_client` = " . $_SESSION["client"] . "
                        AND `dvc_search`.`fk_monde` = " . $_POST["monde"] . "
                        
                        AND `dvc_search`.`fk_document` = `d`.`filename_document`
                        
                        AND `dvc_search`.`fk_champ` = " . $terme["champ"] . "
                        AND `dvc_search`.`fk_valeur_champ` = " . $terme["valeur"] . "
                ) > 0
        ";
    }
    $query .= ")";
}
              


$query .= "# On ne prend que les dernieres revisions
            AND `tdd`.`revision_type_doc` = (
                SELECT MAX(`revision_type_doc`)
                FROM `type_doc_document` AS `tdd2`
                WHERE 
                    `tdd2`.`fk_client` = " . $_SESSION["client"] . "
                    AND `tdd2`.`fk_monde` = " . $_POST["monde"] . "
                    AND `tdd2`.`fk_categorie_doc` = `tdd`.`fk_categorie_doc`
                    AND `tdd2`.`fk_type_doc` = `tdd`.`fk_type_doc`
                    AND `tdd2`.`detail_type_doc` = `tdd`.`detail_type_doc`
                    AND ( SELECT GROUP_CONCAT( 
                            CONCAT_WS('%%', `label_valeur_champ`, `pk_valeur_champ`)
                            SEPARATOR '||'
                         )
                        FROM 
                            `valeur_champ` AS `vc2`,
                            `document_valeur_champ` AS `dvc2`
                        WHERE 
                            `dvc2`.`fk_client` = " . $_SESSION["client"] . "
                            AND `dvc2`.`fk_monde` = " . $_POST["monde"] . "
                            AND `vc2`.`fk_client` = " . $_SESSION["client"] . "
                            AND `vc2`.`fk_monde` = " . $_POST["monde"] . "
                            
                            AND `vc2`.`fk_champ` = `dvc2`.`fk_champ`
                            AND `vc2`.`pk_valeur_champ` = `dvc2`.`fk_valeur_champ`
                            
                            AND `dvc2`.`fk_document` = `tdd2`.`fk_document`
                        ORDER BY `vc2`.`fk_champ`
                    ) = ( SELECT GROUP_CONCAT( 
                            CONCAT_WS('%%', `label_valeur_champ`, `pk_valeur_champ`)
                            SEPARATOR '||'
                         )
                        FROM 
                            `valeur_champ` AS `vc3`,
                            `document_valeur_champ` AS `dvc3`
                        WHERE 
                            `dvc3`.`fk_client` = " . $_SESSION["client"] . "
                            AND `dvc3`.`fk_monde` = " . $_POST["monde"] . "
                            AND `vc3`.`fk_client` = " . $_SESSION["client"] . "
                            AND `vc3`.`fk_monde` = " . $_POST["monde"] . "
                            
                            AND `vc3`.`fk_champ` = `dvc3`.`fk_champ`
                            AND `vc3`.`pk_valeur_champ` = `dvc3`.`fk_valeur_champ`
                            
                            AND `dvc3`.`fk_document` = `d`.`filename_document`
                        ORDER BY `vc3`.`fk_champ`
                    )
            )
        # Tris
        ORDER BY "; 
        
foreach($_POST["champs"] as $idx => $champ) {
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
                
                AND `dvc`.`fk_champ` = " . $champ . "
        ) " . $_POST["tri"] . ", ";
}
$query .= " (
                SELECT `label_categorie_doc`
                FROM `categorie_doc` AS `cd`
                WHERE 
                    `cd`.`fk_client` = " . $_SESSION["client"] . "
                    AND `cd`.`fk_monde` = " . $_POST["monde"] . "
                    AND `cd`.`pk_categorie_doc` = `td`.`fk_categorie_doc`
           ) ASC, `td`.`label_type_doc` ASC, `tdd`.`detail_type_doc` ASC
        
        # Limites    
        LIMIT " . $_POST["limit"][0] . ", " . $_POST["limit"][1] . "         
    ;";
    
    if ($result = $mysqli->query($query)) {
        $valeurs_champs = [];
        $categorie = 0;
        
        while ($row = $result->fetch_assoc()) {
            $champs_documents = [];
            
            // Extraction des valeurs de champs
            foreach(explode("||", $row["champs"]) as $key => $valeur) {
                array_push($champs_documents, $valeur);
            }
            
            // Rupture de valeur de champ
            // TODO : les champs qui ne ruptent pas
            if ($champs_documents != $valeurs_champs) {
                $categorie = 0;
#                array_push($liste, [
#                    "type" => "debug",
#                    "document" => $champs_documents,
#                    "reference" => $valeurs_champs
#                ]);
                
                foreach($champs_documents as $niveau => $champ) {
                    if ($champ != $valeurs_champs[$niveau]) {
                        array_push($liste, [
                            "type" => "champ",
                            "niveau" => $niveau,
                            "pk" => $champ
                        ]);
                    }
                }
            }
           
            // Rupture de catégorie
            if ($row["categorie"] != $categorie) {
                array_push($liste, [
                    "type" => "categorie",
                    "niveau" => count($_POST["champs"]),
                    "pk" => $row["categorie"]
                ]);
            }
           
            // Ajout du document
            $document = [
                "type" => $row["type"],
                "filename" => $row["filename"],
                "date" => $row["date"],
                "detail" => $row["detail"],
                "revision" => $row["revision"]
            ];
            
            array_push($liste, $document);
            
            $valeurs_champs = $champs_documents;
            $categorie = $row["categorie"];
        }
        
        $json = json_encode($liste);
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
