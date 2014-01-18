<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php");
    
    $liste = [];
    
    $tri_whitelist = [
        "ASC" => "ASC",
        "DESC" => "DESC"
    ];
    
    $params = [
        "dvcClient" => $_SESSION["client"],
        "dvcMonde" => $_POST["monde"],
        "vcClient" => $_SESSION["client"],
        "vcMonde" => $_POST["monde"],
        "tdClient" => $_SESSION["client"],
        "tdMonde" => $_POST["monde"],
        "tddClient" => $_SESSION["client"],
        "tddMonde" => $_POST["monde"],
        "dClient" => $_SESSION["client"],
        "niveau" => $_SESSION["niveau"],
        "mini" => $_POST["dates"]["mini"],
        "maxi" => $_POST["dates"]["maxi"],
        "tdd2Client" => $_SESSION["client"],
        "tdd2Monde" => $_POST["monde"],
        "dvc2Client" => $_SESSION["client"],
        "dvc2Monde" => $_POST["monde"],
        "vc2Client" => $_SESSION["client"],
        "vc2Monde" => $_POST["monde"],
        "dvc3Client" => $_SESSION["client"],
        "dvc3Monde" => $_POST["monde"],
        "vc3Client" => $_SESSION["client"],
        "vc3Monde" => $_POST["monde"],
        "dvc4Client" => $_SESSION["client"],
        "dvc4Monde" => $_POST["monde"],
        "vc4Client" => $_SESSION["client"],
        "vc4Monde" => $_POST["monde"],
        "cdClient" => $_SESSION["client"],
        "cdMonde" => $_POST["monde"]
    ]; 
    
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
                `dvc`.`fk_client` = :dvcClient
                AND `dvc`.`fk_monde` = :dvcMonde
                AND `vc`.`fk_client` = :vcClient
                AND `vc`.`fk_monde` = :vcMonde
                
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
            `td`.`fk_client` = :tdClient
            AND `td`.`fk_monde` = :tdMonde
            AND `tdd`.`fk_client` = :tddClient
            AND `tdd`.`fk_monde` = :tddMonde
            AND `d`.`fk_client` = :dClient

            # Jointures
            AND `td`.`fk_champ` = `tdd`.`fk_champ`
            AND `td`.`fk_categorie_doc` = `tdd`.`fk_categorie_doc`
            AND `td`.`pk_type_doc` = `tdd`.`fk_type_doc`
            AND `tdd`.`fk_document` = `d`.`filename_document`
            
            # Verification du niveau
            AND `niveau_document` <= :niveau
            
            # Filtre par dates
            AND `date_document` BETWEEN FROM_UNIXTIME(:mini) AND FROM_UNIXTIME(:maxi)
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
                        `dvc_search`.`fk_client` = :searchClient" . $i . "
                        AND `dvc_search`.`fk_monde` = :searchMonde" . $i . "
                        
                        AND `dvc_search`.`fk_document` = `d`.`filename_document`
                        
                        AND `dvc_search`.`fk_champ` = :searchChamp" . $i . "
                        AND `dvc_search`.`fk_valeur_champ` = :searchTerme" . $i . "
                ) > 0
        ";
        
        $params["searchClient" . $i] = $_SESSION["client"];
        $params["searchMonde" . $i] = $_POST["monde"];
        $params["searchChamp" . $i] = $terme["champ"];
        $params["searchTerme" . $i] = $terme["valeur"];
    }
    $query .= ")";
}
              
if ($_POST["all"] == "false") {
    $query .= "
            # On ne prend que les documents auxquels il a droit 
            AND (
                SELECT COUNT(*)
                FROM `document_valeur_champ` AS `dvc_droits`
                WHERE 
                    `dvc_droits`.`fk_client` = :droitsClient
                    AND `dvc_droits`.`fk_monde` = :droitsMonde
                        
                    AND `dvc_droits`.`fk_document` = `d`.`filename_document`
                    
                    AND `dvc_droits`.`fk_champ` = :droitsChamp
                    AND (
                        ";
    
    $params["droitsClient"] = $_SESSION["client"];
    $params["droitsMonde"] = $_POST["monde"];
    $params["droitsChamp"] = $_POST["champ_droits"];
                       
    $first_droit = true;
                    
        foreach($_POST["droits"] as $pk => $label) {
            if (!$first_droit) {
                $query .= "
                        OR ";
            } else {
                $first_droit = false;
            }
        
            $query .= "`dvc_droits`.`fk_valeur_champ` = :droitsValeur" . $pk;
            
            $params["droitsValeur" . $pk] = (string)$pk;
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
                    `tdd2`.`fk_client` = :tdd2Client
                    AND `tdd2`.`fk_monde` = :tdd2Monde
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
                            `dvc_revisions`.`fk_client` = :dvc2Client
                            AND `dvc_revisions`.`fk_monde` = :dvc2Monde
                            
                            AND `vc_revisions`.`fk_client` = :vc2Client
                            AND `vc_revisions`.`fk_monde` = :vc2Monde
                            
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
                            `dvc3`.`fk_client` = :dvc3Client
                            AND `dvc3`.`fk_monde` = :dvc3Monde
                            
                            AND `vc3`.`fk_client` = :vc3Client
                            AND `vc3`.`fk_monde` = :vc3Monde
                            
                            AND `vc3`.`fk_champ` = `dvc3`.`fk_champ`
                            AND `vc3`.`pk_valeur_champ` = `dvc3`.`fk_valeur_champ`
                            
                            AND `dvc3`.`fk_document` = `d`.`filename_document`
                        ORDER BY `vc3`.`fk_champ`
                    )
            )
        # Tris
        # - Par champ n ASC ou DESC
        # - Par nombre de champs ASC
        # - Par champ n+1 ASC ou DESC
        # - Par nombre de champs ASC ...
        # - Par catégorie ASC, type ASC, détail ASC
        ORDER BY ( 
            SELECT GROUP_CONCAT( 
                CONCAT_WS (
                    '%%', 
                    `label_valeur_champ`, 
                    (
                    ";
                    
        if ($_POST["tri"] == "DESC") {
            $query .= "100 - ";
        }
                    
         $query .= "COUNT(`label_valeur_champ`))
                )
                SEPARATOR '||'
             )
            FROM 
                `valeur_champ` AS `vc4`,
                `document_valeur_champ` AS `dvc4`
            WHERE 
                `dvc4`.`fk_client` = :dvc4Client
                AND `dvc4`.`fk_monde` = :dvc4Monde
                
                AND `vc4`.`fk_client` = :vc4Client
                AND `vc4`.`fk_monde` = :vc4Monde
                
                AND `vc4`.`fk_champ` = `dvc4`.`fk_champ`
                AND `vc4`.`pk_valeur_champ` = `dvc4`.`fk_valeur_champ`
                
                AND `dvc4`.`fk_document` = `d`.`filename_document`
            ORDER BY `vc4`.`fk_champ`
        ) " . $tri_whitelist[$_POST["tri"]] . ", (
                SELECT `label_categorie_doc`
                FROM `categorie_doc` AS `cd`
                WHERE 
                    `cd`.`fk_client` = :cdClient
                    AND `cd`.`fk_monde` = :cdMonde
                    AND `cd`.`pk_categorie_doc` = `td`.`fk_categorie_doc`
           ) ASC, `td`.`label_type_doc` ASC, `tdd`.`detail_type_doc` ASC
        
        # Limites    
        LIMIT 0, 100
    ;";
    
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        $valeurs_champs = [];
        $categorie = 0;
        
        foreach($result["result"] as $row) {
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
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
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
