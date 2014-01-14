<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    // On identifie d'abord les documents à déclassifier
    $query_documents = "
        SELECT `filename_document`
        FROM `document` AS `d`, `document_valeur_champ` AS `dvc`
        WHERE
            `d`.`fk_client` = :dClient
            
            AND `dvc`.`fk_client` = :dvcClient
            AND `dvc`.`fk_monde` = :monde
            AND `dvc`.`fk_champ` = :champ
            AND `dvc`.`fk_valeur_champ` = :pk
            
            AND `dvc`.`fk_document` = `d`.`filename_document`
    ;";
    
    $result_documents = dino_query($query_documents,[
        "dClient" => $_SESSION["client"],
        "dvcClient" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "pk" => $_POST["pk"]
    ]);
    
    if ($result_documents["status"]) {
        // Puis on prépare la requete de delete :
        // - DELETE la valeur_champ et ses enfants
        // - DELETE les associations à des utilisateurs
        $query_delete = "
            DELETE FROM `valeur_champ`
            WHERE
                `fk_client` = :client
                AND `fk_monde` = :monde
                AND ((
                        `fk_champ` = :champ
                        AND `pk_valeur_champ` = :pk
                        AND `fk_parent` = :parent
                    )
                    OR `fk_parent` = :fkParent
                )
        ;";
    
        $result_delete = dino_query($query_delete,[
            "client" => $_SESSION["client"],
            "monde" => $_POST["monde"],
            "champ" => $_POST["champ"],
            "pk" => $_POST["pk"],
            "parent" => $_POST["parent"],
            "fkParent" => $_POST["parent"]
        ]);
        
        if ($result_delete["status"]) {
            $query_delete2 = "
                DELETE FROM `user_valeur_champ`
                WHERE   
                    `fk_client` = :client
                    AND `fk_monde` = :monde
                    AND `fk_champ` = :champ
                    AND `fk_valeur_champ` = :pk
            ;";
    
            $result_delete2 = dino_query($query_delete2,[
                "client" => $_SESSION["client"],
                "monde" => $_POST["monde"],
                "champ" => $_POST["champ"],
                "pk" => $_POST["pk"]
            ]);    
               
            if ($result_delete2["status"]) {    
                foreach ($result_documents as $row_documents) {
                    $query_del_docs .= "
                        UPDATE `document`
                        SET `niveau_document` = NULL
                        WHERE 
                            `fk_client` = :client
                            AND `filename_document` = :filename
                    ;";
                    
                    $result_del_docs = dino_query($query_del_docs,[
                        "client" => $_SESSION["client"],
                        "filename" => $row_documents["filename_document"]
                    ]); 
                    
                    if ($result_del_docs["status"]) {
                        $query_del_types = "
                            DELETE FROM `type_doc_document`
                            WHERE 
                                `fk_client` = :client
                                AND `filename_document` = :filename
                        ;";
                    
                        $result_del_types = dino_query($query_del_types,[
                            "client" => $_SESSION["client"],
                            "filename" => $row_documents["filename_document"]
                        ]); 
                        
                        if ($result_del_types["status"]) {
                            $query_del_valeurs = "
                                DELETE FROM `document_valeur_champ`
                                WHERE 
                                    `fk_client` = :client
                                    AND `filename_document` = :filename
                            ;";
                            
                            $result_del_valeurs = dino_query($query_del_valeurs,[
                                "client" => $_SESSION["client"],
                                "filename" => $row_documents["filename_document"]
                            ]);
                            
                            if (!$result_del_valeurs["status"]) {
                                status(500);
                                write_log([
                                    "libelle" => "GET docs a declassifier",
                                    "admin" => 1,
                                    "query" => $query_del_valeurs,
                                    "statut" => 1,
                                    "message" => $result_del_valeurs["errinfo"][2],
                                    "erreur" => $result_del_valeurs["errno"],
                                    "document" => "",
                                    "objet" => $_POST["pk"]
                                ]);
                                break;
                            }
                        } else {
                            status(500);
                            write_log([
                                "libelle" => "GET docs a declassifier",
                                "admin" => 1,
                                "query" => $query_del_types,
                                "statut" => 1,
                                "message" => $result_del_types["errinfo"][2],
                                "erreur" => $result_del_types["errno"],
                                "document" => "",
                                "objet" => $_POST["pk"]
                            ]);
                            break;
                        }
                    } else {
                        status(500);
                        write_log([
                            "libelle" => "GET docs a declassifier",
                            "admin" => 1,
                            "query" => $query_del_docs,
                            "statut" => 1,
                            "message" => $result_del_docs["errinfo"][2],
                            "erreur" => $result_del_docs["errno"],
                            "document" => "",
                            "objet" => $_POST["pk"]
                        ]);
                        break;
                    }
                } // Fin foreach DOCUMENTS
                
                status(200);
                write_log([
                    "libelle" => "DELETE valeur de champ",
                    "admin" => 1,
                    "query" => "...",
                    "statut" => 0,
                    "message" => "",
                    "erreur" => "",
                    "document" => "",
                    "objet" => $_POST["pk"]
                ]);
            } else {
                status(500);
                write_log([
                    "libelle" => "GET docs a declassifier",
                    "admin" => 1,
                    "query" => $query_delete2,
                    "statut" => 1,
                    "message" => $result_delete2["errinfo"][2],
                    "erreur" => $result_delete2["errno"],
                    "document" => "",
                    "objet" => $_POST["pk"]
                ]);
            }
            
        } else {
            status(500);
            write_log([
                "libelle" => "GET docs a declassifier",
                "admin" => 1,
                "query" => $query_delete,
                "statut" => 1,
                "message" => $result_delete["errinfo"][2],
                "erreur" => $result_delete["errno"],
                "document" => "",
                "objet" => $_POST["pk"]
            ]);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "GET docs a declassifier",
            "admin" => 1,
            "query" => $query_documents,
            "statut" => 1,
            "message" => $result_documents["errinfo"][2],
            "erreur" => $result_documents["errno"],
            "document" => "",
            "objet" => $_POST["pk"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "INSERT champ",
        "admin" => 1,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["pk"]
    ]);
}
?>
