<?php
include("../includes/PDO.php");
include("../includes/status.php");

$query = "SELECT * FROM `user` WHERE `login_user` = :login;";

$result = dino_query($query,[
    "login" => $_GET["login"]
]);

if (count($result["result"]) == 0) {
    status(404);
} else {
    status(200);
}
?>
