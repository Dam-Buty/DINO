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
            AND `niveau_document` IS NULL;";
    
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = '{ "status": "OK", "queue": "%%QUEUE%%" }';
        
        $json_queue = "[ ";
        
        while ($row = $result->fetch_assoc()) {
            if ($json_queue != "[ ") {
                $json_queue .= ', ';
            }
            
            $date = substr($row["date_doc"], 8, 2) . "/" . substr($row["date_doc"], 5, 2);
#            $date = substr($row["date_doc"], 8, 2) . "/" . substr($row["date_doc"], 5, 2) . "/" . substr($row["date_doc"], 0, 4);

            if ($row["fk_user"] == $_SESSION["user"]) {
                $user = "usted";
            } else {
                $user = $row["fk_user"];
            }
            
            $json_queue .= '{ "document": "", "status": 1, "size": "' . $row["taille_document"] . '", "li": "", "filename": "' . $row["filename_document"] . '", "displayname": "' . $row["display_document"] . '", "user": "' . $user . '", "date": "el ' . $date . '", "store": { "date": "", "monde": "", "last_champ": "", "champs": { } , "categorie": "", "type_doc": { } } }';
        }
        
        $json_queue .= " ]";
        
        $json = str_replace('"%%QUEUE%%"', $json_queue, $json);
        header('Content-Type: application/json');
        echo $json;
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
