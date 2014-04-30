<?php
include("../includes/functions.php");

if ($_SESSION["niveau"] >= 30) {
    try {
        $dino = new DINOSQL();
        
        if (isset($_POST["client"])) {
            $client = $_POST["client"];
        } else {
            $client = $_SESSION["client"];
        }
        
        $params = [
            "client" => $client,
            "monde" => $_POST["monde"]
        ];
        
        $liste_documents = $dino->query("del_monde_select_documents", $params);
        
        // Selon le mode, on déclassifie ou on supprime
        // les documents concernés
        foreach($liste_documents as $i => $row_document) {            
            if ($_POST["mode"] == "delete") {
                $query = "remove_document";
                dino_delete($row_document["filename_document"], $client);
            } else {
                $query = "del_monde_declass_documents";
            }
            
            $result = $dino->query($query ,[
                "filename" => $row_document["filename_document"]
            ]);
        }
        
        // - Supprime les associations types de doc
        // - Supprime les types de doc 
        // - Supprime les categories
        // - Supprime les associations users-valeurs
        // - supprime les associations document-valeur
        // - supprime les valeurs de champs
        // - supprime les champs
        // - supprime les associations user-monde 
        // - supprime le monde
        $dino->query("del_monde_del_typdocdoc", $params);
        $dino->query("del_monde_del_typdoc", $params);
        $dino->query("del_monde_del_categories", $params);
        $dino->query("del_monde_del_userval", $params);
        $dino->query("del_monde_del_docval", $params);
        $dino->query("del_monde_del_vals", $params);
        $dino->query("del_monde_del_champs", $params);
        $dino->query("del_monde_del_usermonde", $params);
        $dino->query("del_monde_final", $params);
        
        $dino->commit();
        
        status(200);
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Delete monde : droits insuffisants"
    ]);
    status(403);
}
?>
