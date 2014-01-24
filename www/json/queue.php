<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php");
    
    $query = "
        SELECT 
            `filename_document`, 
            `display_document`, 
            `taille_document`, 
            DATE(`date_upload_document`) AS `date_doc`, 
            `fk_user` 
        FROM `document` 
        WHERE 
            `fk_client` = :client
            AND `niveau_document` IS NULL
            AND (
                `fk_user` = :user
                OR 20 <= :niveau
            )
        ORDER BY `display_document` ASC
        ;";
            
    $params = [
        "client" => $_SESSION["client"],
        "user" => $_SESSION["user"],
        "niveau" => $_SESSION["niveau"]
    ];
    
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        status(200);
        $queue = [
            "status" => "OK",
            "queue" => []
        ];
        
        foreach($result["result"] as $row) {
        
            $date = substr($row["date_doc"], 8, 2) . "/" . substr($row["date_doc"], 5, 2);

            if ($row["fk_user"] == $_SESSION["user"]) {
                $user = "usted";
            } else {
                $user = $row["fk_user"];
            }
            
            array_push($queue["queue"], [
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
            ]);
        }
        header('Content-Type: application/json');
        echo json_encode($queue);
    } else {
        status(500);
        write_log([
            "libelle" => "GET queue",
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
        "libelle" => "GET queue",
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
