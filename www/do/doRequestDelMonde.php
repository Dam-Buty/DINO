<?php
include("../includes/functions.php");

try {
    $dino = new DINOSQL();
    
    $params = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "lemode" => $_POST["mode"]
    ];
    
    $dino->query("request_del_monde", $params);    
    $dino->commit();
    
    status(200);
} catch (Exception $e) {
    $dino->rollback();
    status(500);
}
?>
