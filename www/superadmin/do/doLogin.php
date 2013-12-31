<?php
include("../../includes/mysqli.php");
include("../../includes/log.php");

$username = addslashes($_POST["username"]);
$password = $_POST["password"];

$result = $mysqli->query("SELECT `mdp_user`, `niveau_user`, `mail_user` FROM `user` WHERE `login_user` = '" . $username . "' AND `niveau_user` = 999;");

if ($result->num_rows != 0) {
    $row = $result->fetch_assoc();
    if (sha1($password) == $row["mdp_user"]) {
        if ($row["niveau_user"] == 999) {        
            session_start();
            $_SESSION["superadmin"] = 1;
            $_SESSION["mail_superadmin"] = $row["mail_user"];
            //$_SESSION["clef_superadmin"] = $username . $password;            
            header("Location: ../index.php");
        }
    }
    else {
        header("Location: ../login.php?err=pass&username=" . $username);
    }
}
else {
    header("Location: ../login.php?err=login");
}
?>
