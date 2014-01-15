<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 10) {
    include("../includes/PDO.php");
    include("../includes/crypt.php");
    
    $filename = genere_clef(12, TRUE);
    $extension = pathinfo($_FILES['document']['name'], PATHINFO_EXTENSION);
    
    $filesize = filesize($_FILES['document']['tmp_name']);
    
    $query = "
        INSERT INTO `document` (
            `filename_document`, 
            `taille_document`, 
            `display_document`, 
            `fk_client`, 
            `fk_user`, 
            `date_upload_document`
        ) VALUES (
            :filename, 
            :taille, 
            :display, 
            :client, 
            :user, 
            :date
        );";
    
    $params = [
        "filename" => $filename . "." . $extension,
        "taille" => $filesize,
        "display" =>$_FILES['document']['name'],
        "client" =>$_SESSION["client"],
        "user" => $_SESSION["user"],
        "date" =>  date("Y-m-d H:i:s")
    ];
    
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        
        if (move_uploaded_file($_FILES['document']['tmp_name'], "../cache/" . $_SESSION["client"] . "/temp/" . $filename . "." . $extension)) {
            status(201);
            write_log([
                "libelle" => "UPLOAD document",
                "admin" => 0,
                "query" => $query,
                "statut" => 0,
                "message" => "",
                "erreur" => "",
                "document" => "",
                "objet" => $filename . "." . $extension
            ]);
            $json = '{ "status": "OK", "filename": "' . $filename . '.' . $extension . '" }';
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
                "objet" => $filename . "." . $extension
            ]);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "INSERT nouveau document",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $filename . "." . $extension
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "UPLOAD",
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
