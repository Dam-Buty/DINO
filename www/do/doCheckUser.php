<?php
include("../includes/functions.php");

try {
    $dino = new DINOSQL();
    
    $result = $dino->query("check_login",[
        "login" => $_GET["login"]
    ]);

    if (count($result) == 0) {
        status(404);
    } else {
        status(200);
    }
} catch (Exception $e) {
    status(500);
}

?>
