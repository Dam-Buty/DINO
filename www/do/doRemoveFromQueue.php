<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 10) {
    include("../includes/PDO.php");
    
    $path = "../cache/" . $_SESSION["client"] . "/" . $_POST["filename"] . ".css";
    
    if (unlink($path)) {
        $query = "
            DELETE FROM `document` 
            WHERE `filename_document` = :filename
        ;";
    
        $result = dino_query($query,[
            "filename" => $_POST["document"]
        ]);
        
        if ($result["status"]) {
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
                "message" => $result_update["errinfo"][2],
                "erreur" => $result_update["errno"],
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
            "message" => $result_update["errinfo"][2],
            "erreur" => $result_update["errno"],
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
