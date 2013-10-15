<?php
include("../includes/mysqli.php");
include("../includes/crypt.php");
include("../includes/status.php");

$login = $_POST["login"];
$password = $_POST["password"];

$err = 0;

$query = "SELECT `mail_user`, `mdp_user`, `clef_user` FROM `user` WHERE `login_user` = '" . $login . "';";

if ($result = $mysqli->query($query)) {
    if ($row = $result->fetch_assoc()) {
        if ($row["mdp_user"] == custom_hash($password . $login)) {
            session_start();
            $_SESSION["user"] = $login;
            
            // On décrypte la clef
            $clef_cryptee = $row["clef_user"];
            $clef_user = custom_hash($login . $password . $row["mail_user"]);
            
            $clef_stockage = decrypte($clef_user, $clef_cryptee);
            
            $_SESSION["clef"] = $clef_stockage;
                        
            $json = '{ "status": "OK" }';
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
