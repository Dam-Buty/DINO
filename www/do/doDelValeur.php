<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php");
    include("../includes/status.php");
    
    // On identifie d'abord les documents à déclassifier    
    $result_documents = dino_query("del_valeur_select_docs",[
        "dClient" => $_SESSION["client"],
        "dvcClient" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "pk" => $_POST["pk"]
    ]);
    
    $err = false;
    
    if ($result_documents["status"]) {
        // Puis pour chaque document :
        // - On supprime le type de doc
        // - On supprime les associations à des valeurs de champs
        // - On update le doc
        
        foreach ($result_documents["result"] as $row_documents) {
        
            $result_del_types = dino_query("del_valeur_del_types",[
                "client" => $_SESSION["client"],
                "filename" => $row_documents["filename_document"]
            ]); 
            
            if ($result_del_types["status"]) {                
                $result_del_valeurs = dino_query("del_valeur_del_doc_val",[
                    "client" => $_SESSION["client"],
                    "filename" => $row_documents["filename_document"]
                ]);
                
                if ($result_del_valeurs["status"]) {
                    $result_del_docs = dino_query("del_valeur_update_docs",[
                        "client" => $_SESSION["client"],
                        "filename" => $row_documents["filename_document"]
                    ]); 
                
                    if (!$result_del_docs["status"]) {
                        status(500);
                        $err = false;
                        break;
                    }
                } else {
                    status(500);
                    $err = false;
                    break;
                }
            } else {
                status(500);
                $err = false;
                break;
            }
                
        } // Fin foreach DOCUMENTS
        
        // Pour finir :
        // - On supprime toutes les associations à des users
        // - Et on supprime la valeur de champ
    
        if (!$err) {
            $result_delete2 = dino_query("del_valeur_del_user_val",[
                "client" => $_SESSION["client"],
                "monde" => $_POST["monde"],
                "champ" => $_POST["champ"],
                "pk" => $_POST["pk"]
            ]);    
               
            if ($result_delete2["status"]) { 
                $result_delete = dino_query("del_valeur_final",[
                    "client" => $_SESSION["client"],
                    "monde" => $_POST["monde"],
                    "champ" => $_POST["champ"],
                    "pk" => $_POST["pk"],
                    "parent" => $_POST["parent"],
                    "fkParent" => $_POST["pk"]
                ]);
                
                if ($result_delete["status"]) {     
                        status(200);
                } else {
                    status(500);
                }
            } else {
                status(500);
            }
        }
        
        
    } else {
        status(500);
    }
} else {
    status(403);
    dino_log([
        "niveau" => "Z",
        "query" => "Suppression de valeur de champ"
    ]);
}
?>
