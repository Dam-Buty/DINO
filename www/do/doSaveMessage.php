<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] == 999) {
    include("../includes/PDO.php");
    
    $params = [
        "pk" => $_POST["message"],
        "html" => $_POST["html"]
    ];
    
    $result = dino_query("superadmin_update_message", $params);
    
    if ($result["status"]) {
        status(200);
    } else {
        status(500);
    }
    
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Alors petit pédé on se prend pour le superadmin?"
    ]);
    status(403);
}
?>
