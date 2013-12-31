<?php
include("../includes/mysqli.php");
include("../includes/status.php");

$query = "SELECT * FROM `user` WHERE `login_user` = '" . $_GET["login"] . "';";

$res = $mysqli->query($query);

if ($res->num_rows == 0) {
    status(404);
} else {
    status(200);
}
?>
