<?php
include("../includes/log.php");
include("../includes/DINOSQL.php");
include("../includes/status.php");

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
