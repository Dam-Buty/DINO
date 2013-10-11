<?php
include("../includes/mysqli.php");
include("../includes/crypt.php");
include("../includes/status.php");

$login = $_POST["login"];
$password = $_POST["password"];

$err = 0;

$query = "SELECT `login_user`, `mail_user`, `mdp_user`, `niveau_user`, `fk_interlocuteur`, `fk_client`, `clef_user` FROM `user`, `client` WHERE `pk_client` = `fk_client` AND `login_user` = '" . $login . "';";

if ($result = $mysqli->query($query)) {
    if ($row = $result->fetch_assoc()) {
        if ($row["mdp_user"] == $password) {
            session_start();
            $_SESSION["niveau"] = $row["niveau_user"];
            $_SESSION["client"] = $row["fk_client"];
            $_SESSION["interlocuteur"] = $row["fk_interlocuteur"];
            $_SESSION["user"] = $login;
            
            // On décrypte la clef
            $clef_cryptee = $row["clef_user"];
            $clef_user = base64_encode(hash("sha512", $login . $password . $row["mail_client"], TRUE));
            
            
            
            
            // on refait les dossiers au cas où
            if (!file_exists("../cache/" . $_SESSION["client"])) {
                mkdir("../cache/" . $_SESSION["client"]);
                mkdir("../cache/" . $_SESSION["client"] . "/temp");
            }
            
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
