<?php
include("../includes/functions.php");

try {
    $dino = new DINOSQL();
    
    $params_activate = [
        "login" => $_POST["login"]
    ];
    
    $dino->query("activate_final", $params_activate);    
    $dino->commit();
    
    status(200);
} catch (Exception $e) {
    $dino->rollback();
    status(500);
}
?>
