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
    
    $params = [
        "filename" => $filename . "." . $extension,
        "taille" => $filesize,
        "display" =>$_FILES['document']['name'],
        "client" =>$_SESSION["client"],
        "user" => $_SESSION["user"],
        "date" =>  date("Y-m-d H:i:s")
    ];
    
    $result = dino_query("document_add", $params);
    
    if ($result["status"]) {
        
        if (move_uploaded_file($_FILES['document']['tmp_name'], "../cache/" . $_SESSION["client"] . "/temp/" . $filename . "." . $extension)) {
            status(201);
            dino_log([
                "niveau" => "I",
                "message" => "Copie OK",
                "query" => $filename . "." . $extension
            ]);
            $json = '{ "status": "OK", "filename": "' . $filename . '.' . $extension . '" }';
            header('Content-Type: application/json');
            echo $json;
        } else {
            status(500);
            dino_log([
                "niveau" => "E",
                "query" => $_FILES['document']['tmp_name'],
                "errno" => 666,
                "errinfo" => "Copie impossible",
                "params" => json_encode($filename . "." . $extension)
            ]);
        }
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Upload document : droits insuffisants"
    ]);
    status(403);
}
?>
