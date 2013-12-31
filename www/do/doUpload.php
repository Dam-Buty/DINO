<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 10) {
    include("../includes/mysqli.php");
    include("../includes/crypt.php");
    
    $filename = genere_clef(12, TRUE);
    
    $filesize = filesize($_FILES['document']['tmp_name']);
    
    $query = "INSERT INTO `document` (`filename_document`, `taille_document`, `display_document`, `fk_client`, `fk_user`, `date_upload_document`) VALUES ('" . $filename . ".pdf', " . $filesize . ", '" . $_FILES['document']['name'] . "', " . $_SESSION["client"] . ", '" . $_SESSION["user"] . "', '" . date("Y-m-d H:i:s") . "');";
    
    if ($mysqli->query($query)) {
        
        if (move_uploaded_file($_FILES['document']['tmp_name'], "../cache/" . $_SESSION["client"] . "/temp/" . $filename . ".pdf")) {
            status(201);
            write_log([
                "libelle" => "UPLOAD document",
                "admin" => 0,
                "query" => $query,
                "statut" => 0,
                "message" => "",
                "erreur" => "",
                "document" => "",
                "objet" => $filename
            ]);
            $json = '{ "status": "OK", "filename": "' . $filename . '.pdf" }';
            header('Content-Type: application/json');
            echo $json;
        } else {
            status(500);
            write_log([
                "libelle" => "MOVE uploaded document",
                "admin" => 0,
                "query" => $_FILES['document']['tmp_name'],
                "statut" => 1,
                "message" => "",
                "erreur" => "",
                "document" => "",
                "objet" => $filename
            ]);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "MOVE uploaded document",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $filename
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "MOVE uploaded document",
        "admin" => 0,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_FILES['document']['tmp_name']
    ]);
}
?>
