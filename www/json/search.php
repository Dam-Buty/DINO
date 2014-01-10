<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

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
            ( SELECT GROUP_CONCAT( `pk_valeur_champ` SEPARATOR '||' )
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
            
            # Verification du niveau
            AND `niveau_document` <= " . $_SESSION["niveau"] . "
            
            # Filtre par dates
            AND `date_document` BETWEEN FROM_UNIXTIME('" . $_POST["dates"]["mini"] . "') AND FROM_UNIXTIME('" . $_POST["dates"]["maxi"] . "')
            ";
            
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
              
if ($_POST["all"] == "false") {
    $query .= "
            # On ne prend que les documents auxquels l'user a droit 
            AND (
                SELECT COUNT(*)
                FROM `document_valeur_champ` AS `dvc_droits`
                WHERE 
                    `dvc_droits`.`fk_client` = " . $_SESSION["client"] . "
                    AND `dvc_droits`.`fk_monde` = " . $_POST["monde"] . "
                        
                    AND `dvc_droits`.`fk_document` = `d`.`filename_document`
                    
                    AND `dvc_droits`.`fk_champ` = " . $_POST["champs"][0] . "
                    AND (
                        ";
                        
    $first_droit = true;
                    
        foreach($_POST["droits"] as $pk => $label) {
            if (!$first_droit) {
                $query .= "
                        OR ";
            } else {
                $first_droit = false;
            }
        
            $query .= "`dvc_droits`.`fk_valeur_champ` = " . $pk . "";
        }
                        
    $query .= "
                    )
                    
            ) > 0
    ";
}

$query .= "
            # On ne prend que les dernieres revisions
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
                            `valeur_champ` AS `vc_revisions`,
                            `document_valeur_champ` AS `dvc_revisions`
                        WHERE 
                            `dvc_revisions`.`fk_client` = " . $_SESSION["client"] . "
                            AND `dvc_revisions`.`fk_monde` = " . $_POST["monde"] . "
                            AND `vc_revisions`.`fk_client` = " . $_SESSION["client"] . "
                            AND `vc_revisions`.`fk_monde` = " . $_POST["monde"] . "
                            
                            AND `vc_revisions`.`fk_champ` = `dvc_revisions`.`fk_champ`
                            AND `vc_revisions`.`pk_valeur_champ` = `dvc_revisions`.`fk_valeur_champ`
                            
                            AND `dvc_revisions`.`fk_document` = `tdd2`.`fk_document`
                        ORDER BY `vc_revisions`.`fk_champ`
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
        # Tris :
        # - Par champ n ASC ou DESC
        # - Par nombre de champs ASC
        # - Par champ n+1 ASC ou DESC
        # - Par nombre de champs ASC ...
        # - Par catégorie ASC, type ASC, détail ASC
        ORDER BY  "; 
        
foreach($_POST["champs"] as $idx => $champ) {
    $query .= "(
            SELECT `label_valeur_champ`
            FROM 
                `valeur_champ` AS `vc_champs`,
                `document_valeur_champ` AS `dvc_champs`
            WHERE 
                `dvc_champs`.`fk_client` = " . $_SESSION["client"] . "
                AND `dvc_champs`.`fk_monde` = " . $_POST["monde"] . "
                AND `vc_champs`.`fk_client` = " . $_SESSION["client"] . "
                AND `vc_champs`.`fk_monde` = " . $_POST["monde"] . "
                
                AND `vc_champs`.`fk_champ` = `dvc_champs`.`fk_champ`
                AND `vc_champs`.`pk_valeur_champ` = `dvc_champs`.`fk_valeur_champ`
                
                AND `dvc_champs`.`fk_document` = `d`.`filename_document`
                
                AND `dvc_champs`.`fk_champ` = " . $champ . "
        ) " . $_POST["tri"] . ", (
            SELECT COUNT(*) 
            FROM `document_valeur_champ` AS `dvc_tri`
            WHERE
                `dvc_tri`.`fk_client` = " . $_SESSION["client"] . "
                AND `dvc_tri`.`fk_monde` = " . $_POST["monde"] . "
                AND `dvc_tri`.`fk_document` = `d`.`filename_document`
        ) ASC, ";
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
            if ($champs_documents != $valeurs_champs) {
                $categorie = 0;
                
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
                    "niveau" => count($champs_documents),
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
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
        write_log([
            "libelle" => "GET liste documents",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $_POST["monde"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "GET liste documents",
        "admin" => 0,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["monde"]
    ]);
}
?>
