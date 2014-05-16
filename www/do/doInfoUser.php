<?php
session_start();

include("../includes/functions.php");

try {
    $dino = new DINOSQL();
    
    $dino->query("info_user",[
        "nom" => $_POST["nom"],
        "mail" => $_POST["mail"],
        "client" => $_SESSION["client"]
    ]);
    
    $dino->query("info_client",[
        "entreprise" => $_POST["entreprise"],
        "client" => $_SESSION["client"]
    ]);

    $dino->commit();
    status(200);
} catch (Exception $e) {
    $dino->rollback();
    status(500);
}
?>
