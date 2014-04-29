<?php
session_start();
include("../includes/functions.php");

if (isset($_SESSION["niveau"])) {
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
