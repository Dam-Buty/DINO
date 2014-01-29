<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

function format_date($date) {
    $d = substr($date, 0, 2);
    $m = substr($date, 3, 2);
    $y = substr($date, 6, 4);
    
    return $y . "-" . $m . "-" . $d;
}

$champs = array_filter($_POST["champs"]);

if ($_SESSION["niveau"] >= 10) {
    include("../includes/PDO.php");
    
    
    
    $query_document = "
        UPDATE `document` 
        SET 
            niveau_document = 0, 
            date_document = :date
        WHERE `filename_document` = :filename ;";
        
    $params_document = [
        "date" => format_date($_POST["date"]),
        "filename" => $_POST["filename"]
    ];
    
    $result_document = dino_query($query_document, $params_document);
        
    if ($result_document["status"]) {
        $params_type = [
            "type" => $_POST["type"],
            "categorie" => $_POST["categorie"],
            "champ" => $_POST["maxchamp"],
            "monde" => $_POST["monde"],
            "client" => $_SESSION["client"],
            "filename" => $_POST["filename"],
            "detail" => $_POST["detail"],
            "dClient" => $_SESSION["client"],
            "tddClient" => $_SESSION["client"],
            "tddMonde" => $_POST["monde"],
            "tddCategorie" => $_POST["categorie"],
            "tddType" => $_POST["type"],
            "tddDetail" => $_POST["detail"]
        ];
        
        $query_type = "
            INSERT INTO `type_doc_document` (
                `fk_type_doc`, 
                `fk_categorie_doc`, 
                `fk_champ`, 
                `fk_monde`, 
                `fk_client`, 
                `fk_document`, 
                `detail_type_doc`, 
                `revision_type_doc`
            ) VALUES (
                :type, 
                :categorie, 
                :champ, 
                :monde, 
                :client, 
                :filename, 
                :detail, 
                (
                    SELECT COALESCE(MAX(`revision_type_doc`) + 1, 1) 
                    FROM (
                        SELECT `revision_type_doc` 
                        FROM 
                            `type_doc_document` AS `tdd`,
                            `document` AS `d`
                        WHERE 
                            `d`.`fk_client` = :dClient
                            AND `d`.`filename_document` = `tdd`.`fk_document`
                        
                            AND `tdd`.`fk_client` = :tddClient
                            AND `tdd`.`fk_monde` = :tddMonde
                            AND `tdd`.`fk_categorie_doc` = :tddCategorie
                            AND `tdd`.`fk_type_doc` = :tddType 
                            
                            AND `tdd`.`detail_type_doc` = :tddDetail
                            
        ";
        
        foreach($champs as $pk => $valeur) {
            $query_type .= " 
                            AND (
                                SELECT COUNT(*) 
                                FROM `document_valeur_champ` AS `dvc` 
                                WHERE `dvc`.`fk_client` = :client" . $pk . "
                                    AND `dvc`.`fk_monde` = :monde" . $pk . "
                                    AND `dvc`.`fk_champ` = :champ" . $pk . "
                                    AND `dvc`.`fk_valeur_champ` = :valeur" . $pk . "
                                    AND `dvc`.`fk_document` = `tdd`.`fk_document`
                                ) > 0";
                                
            $params_type["client" . $pk] = $_SESSION["client"];
            $params_type["monde" . $pk] = $_POST["monde"];
            $params_type["champ" . $pk] = $pk;
            $params_type["valeur" . $pk] = $valeur;
        }
    
        if ($_POST["time"] != "000000") {
            $query_type .= "
                            AND LEFT(
                                `d`.`date_document` * 1, 6
                            ) = :time";
            $params_type["time"] = $_POST["time"];
        }
    
        $query_type .= "
                ) AS `magic_revision` 
            )
        );";
        
        $result_type = dino_query($query_type, $params_type);
        
        if ($result_type["status"]) {
            
            $err = false;
            
            foreach($champs as $pk => $valeur) {
                $query_champ .= "INSERT INTO `document_valeur_champ` (
                            `fk_document`, 
                            `fk_monde`, 
                            `fk_client`, 
                            `fk_valeur_champ`, 
                            `fk_champ`
                        ) VALUES (
                            :filename, 
                            :monde, 
                            :client, 
                            :valeur, 
                            :pk
                        );";
                        
                $params_champ = [
                    "filename" => $_POST["filename"],
                    "monde" => $_POST["monde"],
                    "client" => $_SESSION["client"],
                    "valeur" => $valeur,
                    "pk" => $pk
                ];
                
                $result_champ = dino_query($query_champ, $params_champ);
                
                if (!$result_champ["status"]) {
                    status(500);
                    write_log([
                        "libelle" => "STORE document",
                        "admin" => 0,
                        "query" => $query_type,
                        "statut" => 1,
                        "message" => $result_type["errinfo"][2],
                        "erreur" => $result_type["errno"],
                        "document" => "",
                        "objet" => $_POST["filename"]
                    ]);
                    $err = true;
                    break;
                }
            } // FIN FOREACH CHAMP
            
            if (!$err) {
                status(200);
                write_log([
                    "libelle" => "STORE document",
                    "admin" => 0,
                    "query" => $query,
                    "statut" => 0,
                    "message" => "",
                    "erreur" => "",
                    "document" => "",
                    "objet" => $_POST["filename"]
                ]);
            }
        } else {
            status(500);
            write_log([
                "libelle" => "STORE document",
                "admin" => 0,
                "query" => $query_type,
                "statut" => 1,
                "message" => $result_type["errinfo"][2],
                "erreur" => $result_type["errno"],
                "document" => "",
                "objet" => $_POST["filename"]
            ]);
        }    
    } else {
        status(500);
        write_log([
            "libelle" => "STORE document",
            "admin" => 0,
            "query" => $query_document,
            "statut" => 1,
            "message" => $result_document["errinfo"][2],
            "erreur" => $result_document["errno"],
            "document" => "",
            "objet" => $_POST["filename"]
        ]);
    } 
} else {
    status(403);
    write_log([
        "libelle" => "STORE document",
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
