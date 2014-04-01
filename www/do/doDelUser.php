<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php");
    include("../includes/status.php");
    
    $result_user = dino_query("delete_user",[
        "client" => $_SESSION["client"],
        "niveau" => $_SESSION["niveau"],
        "login" => $_POST["login"]
    ]);
    
    if ($result_user["status"]) {
        status(204);
    } else {
        status(500);
    } 
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Suppression d'user : droits insuffisants"
    ]);
    status(403);
}
?>
