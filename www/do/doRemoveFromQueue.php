<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 10) {
    include("../includes/mysqli.php");
    
    $path = "../cache/" . $_SESSION["client"] . "/" . $_POST["filename"] . ".css";
    
    if (unlink($path)) {
        $query = "DELETE FROM `document` WHERE `filename_document` = '" . $_POST["filename"] . "';";
        
        if ($mysqli->query($query)) {
            status(204);
            write_log([
                "libelle" => "DELETE document de la queue",
                "admin" => 0,
                "query" => $query,
                "statut" => 0,
                "message" => "",
                "erreur" => "",
                "document" => $_POST["filename"],
                "objet" => $_POST["filename"]
            ]);
        } else {
            status(500);
            write_log([
                "libelle" => "DELETE document de la queue",
                "admin" => 0,
                "query" => $query,
                "statut" => 1,
                "message" => "",
                "erreur" => $mysqli->error,
                "document" => $_POST["filename"],
                "objet" => $_POST["filename"]
            ]);
        }
    } else {
        status(500);
        $json = '{ "error": "unknown" }';
        write_log([
            "libelle" => "UNLINK document de la queue",
            "admin" => 0,
            "query" => "unlink " . $path,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => $_POST["filename"],
            "objet" => $_POST["filename"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "DELETE document de la queue",
        "admin" => 0,
        "query" => "unlink " . $path,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => $_POST["filename"],
        "objet" => $_POST["filename"]
    ]);
}
?>
