<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 10) {
    include("../includes/DINOSQL.php");
    
    $path = "../cache/" . $_SESSION["client"] . "/" . $_POST["filename"] . ".dino";
    $pdfpath = "../cache/" . $_SESSION["client"] . "/" . $_POST["filename"] . "-pdf.dino";
    
    try {
        $dino = new DINOSQL();
        
        $result = $dino->query("remove_document",[
            "filename" => $_POST["filename"]
        ]);
            
        if (unlink($path)) {
            $dino->commit();
            
            if (file_exists($pdfpath)) {
                if (unlink($pdfpath)) {
                    status(204);
                    dino_log([
                        "niveau" => "I",
                        "message" => "Unlink document",
                        "query" => $_POST["filename"]
                    ]);
                } else {
                    status(204);
                    dino_log([
                        "niveau" => "E",
                        "query" => "unlink " . $pdfpath,
                        "errno" => 666,
                        "errinfo" => "Impossible de supprimer",
                        "params" => json_encode($_POST["filename"])
                    ]);
                }
            } else {
                status(204);
                dino_log([
                    "niveau" => "I",
                    "message" => "Unlink document",
                    "query" => $_POST["filename"]
                ]);
            }
        } else {
            status(500);
            dino_log([
                "niveau" => "E",
                "query" => "unlink " . $path,
                "errno" => 666,
                "errinfo" => "Impossible de supprimer",
                "params" => json_encode($_POST["filename"])
            ]);
        }
    } catch (Exception $e) {
        status(500);
    }
} else {
    status(403);
    dino_log([
        "niveau" => "Z",
        "query" => "Delete document : droits insuffisants"
    ]);
}
?>
