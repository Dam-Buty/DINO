<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 10) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    // On identifie d'abord les documents à déclassifier
    $query = "
        UPDATE `document`
        SET `niveau_document` = NULL
        WHERE 
            `fk_client` = " . $_SESSION["client"] . "
            AND `filename_document` = '" . $_POST["filename"] . "';
        DELETE FROM `type_doc_document`
        WHERE 
            `fk_client` = " . $_SESSION["client"] . "
            AND `fk_document` = '" . $_POST["filename"] . "';
        DELETE FROM `document_valeur_champ`
        WHERE 
            `fk_client` = " . $_SESSION["client"] . "
            AND `fk_document` = '" . $_POST["filename"] . "';";
    
    if ($mysqli->multi_query($query)) {
        $i = 0; 
        do { 
            $i++; 
        } while ($mysqli->next_result()); 
        
        status(200);
        write_log([
            "libelle" => "REQUEUE document",
            "admin" => 0,
            "query" => $query,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $_POST["filename"]
        ]);
    } else {
        status(500);
        write_log([
            "libelle" => "REQUEUE document",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $_POST["filename"]
        ]);
    }    
} else {
    status(403);
    write_log([
        "libelle" => "REQUEUE document",
        "admin" => 1,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["filename"]
    ]);
}
?>
