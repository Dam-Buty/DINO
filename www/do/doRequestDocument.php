<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php"); 

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    
    $query = "
        SELECT 
            `filename_document`, 
            `display_document`, 
            `taille_document`, 
            DATE(`date_upload_document`) AS `date_doc`, 
            `fk_user` 
        FROM `document` 
        WHERE 
            `fk_client` = " . $_SESSION["client"] . " 
            AND `niveau_document` = 999
        LIMIT 1
        ;";
    
    $document = [];
    
    if ($result = $mysqli->query($query)) {
        if ($result->num_rows == 0) {
            status(204);
        } else {
            if ($row = $result->fetch_assoc()) {
                
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
                    "date" => "el ' . $date . '",
                    "store" => [
                        "date" => "",
                        "monde" => "",
                        "last_champ" => "",
                        "champs" => [],
                        "categorie" => "",
                        "type_doc" => []
                    ]
                ];
                
                $query_update = "
                    UPDATE `document`
                    SET
                        `niveau_document` = 888
                    WHERE 
                        `fk_client` = " . $_SESSION["client"] . "
                        AND `filename_document` = '" . $row["filename_document"] . "'
                ;";
                
                if ($mysqli->query($query_update)) {
                    status(200);
                    header('Content-Type: application/json');
                    echo json_encode($document);
                } else {
                    status(500);
                    write_log([
                        "libelle" => "UPDATE document a cleaner",
                        "admin" => 0,
                        "query" => $query_update,
                        "statut" => 1,
                        "message" => "",
                        "erreur" => $mysqli->error,
                        "document" => "",
                        "objet" => $row["filename_document"]
                    ]);
                }
                
            } else {
                status(500);
                write_log([
                    "libelle" => "GET document a cleaner",
                    "admin" => 0,
                    "query" => $query,
                    "statut" => 1,
                    "message" => "",
                    "erreur" => $mysqli->error,
                    "document" => "",
                    "objet" => $_SESSION["client"]
                ]);
            }
        }
    } else {
        status(500);
        write_log([
            "libelle" => "GET document a cleaner",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $_SESSION["client"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "GET document a cleaner",
        "admin" => 0,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => ""
    ]);
}
?>
