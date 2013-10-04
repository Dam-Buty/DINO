<?php
include("../includes/mysqli.php");
include("../includes/crypt.php");
include("../includes/status.php");

$login = $_POST["login"];
$password = $_POST["password"];

$err = 0;

$query = "SELECT `login_user`, `mail_user`, `mdp_user`, `niveau_user`, `fk_interlocuteur`, `fk_client` FROM `user`, `client` WHERE `pk_client` = `fk_client` AND `login_user` = '" . $login . "';";

if ($result = $mysqli->query($query)) {
    if ($row = $result->fetch_assoc()) {
        if ($row["mdp_user"] == $password) {
            session_start();
            $_SESSION["niveau"] = $row["niveau_user"];
            $_SESSION["client"] = $row["fk_client"];
            $_SESSION["interlocuteur"] = $row["fk_interlocuteur"];
            $_SESSION["user"] = $login;
            $json = '{ "mail": "' . $row["mail_user"] . '" }';
            status(200);
        } else {
            status(403);
            $json = '{ "error": "pass" }';
        }
    } else {
        status(403);
        $json = '{ "error": "login" }';
    }
} else {
    status(500);
    $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '"}';
}

header('Content-Type: application/json');
echo $json;
?>
