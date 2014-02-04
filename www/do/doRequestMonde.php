<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php"); 

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php");
    
    $query = "
        INSERT INTO `demande` (
            `monde_demande`,
            `critere_demande`,
            `documents_demande`,
            `fk_user`,
            `fk_client`
        ) VALUES (
            :monde,
            :critere,
            :documents,
            :user,
            :client
        );";
    
    $result = dino_query($query, [
        "monde" => $_POST["monde"],
        "critere" => $_POST["critere"],
        "documents" => $_POST["documents"],
        "user" => $_SESSION["user"],
        "client" => $_SESSION["client"]
    ]);
    
    $document = [];
    
    if ($result["status"]) {
        status(200);
    } else {
        status(500);
        write_log([
            "libelle" => "INSERT demande de monde",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_POST["monde"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "INSERT demande de monde",
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
