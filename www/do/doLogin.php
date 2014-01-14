<?php
include("../includes/PDO.php");
include("../includes/log.php");
include("../includes/crypt.php");
include("../includes/status.php");

$login = $_POST["login"];
$password = $_POST["password"];

$query = "SELECT `mail_user`, `mdp_user`, `clef_user`, `niveau_user` FROM `user` WHERE `login_user` = :login ;";

$result = dino_query($query,[
    "login" => $login
]);

if ($result["status"]) {
    if (count($result["result"]) > 0) {
        $row = $result["result"][0];
        
        if ($row["mdp_user"] == custom_hash($password . $login, TRUE)) {
            session_start();
            $_SESSION["user"] = $login;
            $_SESSION["niveau"] = $row["niveau_user"];
            
            // On décrypte la clef
            $clef_cryptee = $row["clef_user"];
            $clef_user = custom_hash($login . $password . $row["mail_user"]);
            
            $clef_stockage = decrypte($clef_user, $clef_cryptee);
            
            $_SESSION["clef"] = $clef_stockage;
            
            write_log([
                "libelle" => "LOGIN",
                "admin" => 0,
                "query" => $query,
                "statut" => 0,
                "message" => "",
                "erreur" => "",
                "document" => "",
                "objet" => $_POST["login"]
            ]);
            status(200);
        } else {
            status(403);
            $json = json_encode([
                "error" => "pass"
            ]);
            write_log([
                "libelle" => "LOGIN",
                "admin" => 0,
                "query" => $query,
                "statut" => 555,
                "message" => "",
                "erreur" => "pass",
                "document" => "",
                "objet" => $_POST["login"]
            ]);
            header('Content-Type: application/json');
            echo $json;
        }
    } else {
        status(403);
        $json = json_encode([
            "error" => "login"
        ]);
        write_log([
            "libelle" => "LOGIN",
            "admin" => 0,
            "query" => $query,
            "statut" => 555,
            "message" => "",
            "erreur" => "login",
            "document" => "",
            "objet" => $_POST["login"]
        ]);
        header('Content-Type: application/json');
        echo $json;
    }
} else {
    status(500);
    write_log([
        "libelle" => "LOGIN",
        "admin" => 0,
        "query" => $query,
        "statut" => 1,
        "message" => $result["errinfo"][2],
        "erreur" => $result["errno"],
        "document" => "",
        "objet" => $_POST["login"]
    ]);
}
?>
