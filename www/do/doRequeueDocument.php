<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 10) {
    include("../includes/PDO.php");
    include("../includes/status.php");
    
    $query_document = "
        UPDATE `document`
        SET `niveau_document` = NULL
        WHERE 
            `fk_client` = :client
            AND `filename_document` = :filename ;";
            
    $result_document = dino_query($query_document,[
        "client" => $_SESSION["client"],
        "filename" => $_POST["filename"]
    ]);
    
    if ($result_document["status"]) { 
       
        $query_type = "
            DELETE FROM `type_doc_document`
            WHERE 
                `fk_client` = :client
                AND `fk_document` = :filename ;";
            
        $result_type = dino_query($query_type,[
            "client" => $_SESSION["client"],
            "filename" => $_POST["filename"]
        ]);
        
        if ($result_type["status"]) {
                    
            $query_valeur = "
                DELETE FROM `document_valeur_champ`
                WHERE 
                    `fk_client` = :client
                    AND `fk_document` = :filename ;"; 
                     
            $result_valeur = dino_query($query_valeur,[
                "client" => $_SESSION["client"],
                "filename" => $_POST["filename"]
            ]);   
            
            if ($result_valeur["status"]) {
                status(200);
                write_log([
                    "libelle" => "REQUEUE document",
                    "admin" => 0,
                    "query" => $query,
                    "statut" => 0,
                    "message" => "",
                    "erreur" => "",
                    "document" => "",
                    "objet" => $_POST["filename"]
                ]);
            } else {
                status(500);
                write_log([
                    "libelle" => "UPDATE document a cleaner",
                    "admin" => 0,
                    "query" => $query_valeur,
                    "statut" => 1,
                    "message" => $result_valeur["errinfo"][2],
                    "erreur" => $result_valeur["errno"],
                    "document" => "",
                    "objet" => $POST["document"]
                ]);
            }
        } else {
            status(500);
            write_log([
                "libelle" => "UPDATE document a cleaner",
                "admin" => 0,
                "query" => $query_type,
                "statut" => 1,
                "message" => $result_type["errinfo"][2],
                "erreur" => $result_type["errno"],
                "document" => "",
                "objet" => $POST["document"]
            ]);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "UPDATE document a cleaner",
            "admin" => 0,
            "query" => $query_document,
            "statut" => 1,
            "message" => $result_document["errinfo"][2],
            "erreur" => $result_document["errno"],
            "document" => "",
            "objet" => $POST["document"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "REQUEUE document",
        "admin" => 1,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["filename"]
    ]);
}
?>
