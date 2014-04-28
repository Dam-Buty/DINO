<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php"); 

if (isset($_SESSION["niveau"])) {
    include("../includes/DINOSQL.php");
    
    try {
        $dino = new DINOSQL();
        
        $result = $dino->query("request_document_select", [
            "client" => $_SESSION["client"]
        ]);
        
        $document = [];
        
        if (count($result) == 0) {
            status(204);
        } else {
            $row = $result[0];
            
            $date = substr($row["date_doc"], 8, 2) . "/" . substr($row["date_doc"], 5, 2);
            $user = $row["fk_user"];
            
            $document = [
                "document" => "",
                "status" => 1,
                "size" => $row["taille_document"],
                "li" => "",
                "filename" => $row["filename_document"],
                "displayname" => $row["display_document"],
                "user" => $user,
                "date" => "el " . $date,
                "store" => [
                    "date" => "",
                    "monde" => "",
                    "last_champ" => "",
                    "champs" => [],
                    "categorie" => "",
                    "type_doc" => []
                ]
            ];
            
            $result_update = $dino->query("request_document_update", [
                "client" => $_SESSION["client"],
                "filename" => $row["filename_document"]
            ]);
            
            $dino->commit();
            status(200);
            header('Content-Type: application/json');
            echo json_encode($document);
        }
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Request document : pas de niveau session"
    ]);
    status(403);
}
?>
