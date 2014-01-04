<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    
    $query_update = "
        UPDATE `document`
        SET
            `niveau_document` = NULL
        WHERE 
            `fk_client` = " . $_SESSION["client"] . "
            AND `filename_document` = '" . $_POST["document"] . "'
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
            "objet" => $POST["filename_document"]
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
