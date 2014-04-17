<?php
include("../includes/PDO.php");
include("../includes/status.php");
include("../includes/log.php");

$params_activate = [
    "login" => $_POST["login"]
];

if (dino_query("activate_final", $params_activate)) {
    status(200);
} else {
    status(500);
}
?>
