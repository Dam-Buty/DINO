<?php
include("../includes/PDO.php");
include("../includes/status.php");

$result = dino_query("check_login",[
    "login" => $_GET["login"]
]);

if (count($result["result"]) == 0) {
    status(404);
} else {
    status(200);
}
?>
