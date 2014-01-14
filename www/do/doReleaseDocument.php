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
            `fk_client` = " .  . "
            AND `filename_document` = '" .  . "'
    ;";
    
    $result_update = dino_query($query_update,[
        "client" => $_SESSION["client"],
        "filename" => $_POST["document"]
    ]);
    
    if ($result_update["status"]) {
        status(200);
    } else {
        status(500);
        write_log([
            "libelle" => "UPDATE document a cleaner",
            "admin" => 0,
            "query" => $query_update,
            "statut" => 1,
            "message" => $result_update["errinfo"][2],
            "erreur" => $result_update["errno"],
            "document" => "",
            "objet" => $POST["document"]
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
        "objet" => $POST["document"]
    ]);
}
?>
