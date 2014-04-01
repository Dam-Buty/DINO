<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php"); 

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php");
    
    $result = dino_query("request_document_select", [
        "client" => $_SESSION["client"]
    ]);
    
    $document = [];
    
    if ($result["status"]) {
        if (count($result["result"]) == 0) {
            status(204);
        } else {
                
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
            
            $result_update = dino_query("request_document_update", [
                "client" => $_SESSION["client"],
                "filename" => $row["filename_document"]
            ]);
            
            if ($result_update["status"]) {
                status(200);
                header('Content-Type: application/json');
                echo json_encode($document);
            } else {
                status(500);
            }
        }
    } else {
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
