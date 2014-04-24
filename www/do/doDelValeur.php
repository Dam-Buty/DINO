<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/DINOSQL.php");
    include("../includes/status.php");
    
    
    try {
        $dino = new DINOSQL();
        
        // On identifie d'abord les documents à déclassifier    
        $result_documents = $dino->query("del_valeur_select_docs",[
            "dClient" => $_SESSION["client"],
            "dvcClient" => $_SESSION["client"],
            "monde" => $_POST["monde"],
            "champ" => $_POST["champ"],
            "pk" => $_POST["pk"]
        ]);

        // Puis pour chaque document :
        // - On supprime le type de doc
        // - On supprime les associations à des valeurs de champs
        // - On update le doc
        foreach ($result_documents as $row_documents) {
            $params = [
                "client" => $_SESSION["client"],
                "filename" => $row_documents["filename_document"]
            ];
        
            $dino->query("del_valeur_del_types", $params); 
                     
            $dino->query("del_valeur_del_doc_val", $params);
                
            $dino->query("del_valeur_update_docs", $params);  
        } // Fin foreach DOCUMENTS
            
        // Pour finir :
        // - On supprime toutes les associations à des users
        // - Et on supprime la valeur de champ

        $dino->query("del_valeur_del_user_val",[
            "client" => $_SESSION["client"],
            "monde" => $_POST["monde"],
            "champ" => $_POST["champ"],
            "pk" => $_POST["pk"]
        ]);    
           
        $dino->query("del_valeur_final",[
            "client" => $_SESSION["client"],
            "monde" => $_POST["monde"],
            "champ" => $_POST["champ"],
            "pk" => $_POST["pk"],
            "parent" => $_POST["parent"],
            "fkParent" => $_POST["pk"]
        ]);
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
        status(500);
    }
    
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Suppression de valeur de champ : droits insuffisants"
    ]);
    status(403);
}
?>
