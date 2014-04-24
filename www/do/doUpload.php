<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 10) {
    include("../includes/DINOSQL.php");
    include("../includes/crypt.php");
    
    $filename = genere_clef(12, TRUE);
    $extension = pathinfo($_FILES['document']['name'], PATHINFO_EXTENSION);
    
    $filesize = filesize($_FILES['document']['tmp_name']);
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "filename" => $filename . "." . $extension,
            "taille" => $filesize,
            "display" =>$_FILES['document']['name'],
            "client" =>$_SESSION["client"],
            "user" => $_SESSION["user"],
            "date" =>  date("Y-m-d H:i:s")
        ];
        
        $dino->query("document_add", $params);
            
        if (move_uploaded_file($_FILES['document']['tmp_name'], "../cache/" . $_SESSION["client"] . "/temp/" . $filename . "." . $extension)) {
            $dino->commit();
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
            $dino->rollback();
            status(500);
            dino_log([
                "niveau" => "E",
                "query" => $_FILES['document']['tmp_name'],
                "errno" => 666,
                "errinfo" => "Copie impossible",
                "params" => json_encode($filename . "." . $extension)
            ]);
        } 
    } catch (Exception $e) {
        $dino->rollback();
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
