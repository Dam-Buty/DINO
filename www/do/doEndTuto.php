<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if (isset($_SESSION["niveau"])) {
    include("../includes/DINOSQL.php");
    try {
        $dino = new DINOSQL();
        
        $dino->query("end_tuto",[
            "user" => $_SESSION["user"],
            "tuto" => $_POST["tuto"]
        ]);     
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "End tuto : pas de niveau session"
    ]);
    status(403);
}
?>
