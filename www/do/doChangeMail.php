<?php
session_start();

if (isset($_SESSION["user"])) {
    include("../includes/mysqli.php");
    include("../includes/log.php");
    include("../includes/crypt.php");
    include("../includes/status.php");

    $pass = $_POST["pass"];
    $new_mail = $_POST["mail"];

    $login = $_SESSION["user"];

    $query = "SELECT `mdp_user`, `clef_user`, `mail_user` FROM `user` WHERE `login_user` = '" . $login . "';";

    if ($result = $mysqli->query($query)) {
        if ($row = $result->fetch_assoc()) {
            if ($row["mdp_user"] == custom_hash($pass . $login, TRUE)) {  
                $old_mail = $row["mail_user"];
                
                // On décrypte la clef
                $clef_cryptee = $row["clef_user"];
                $old_clef = custom_hash($login . $pass . $old_mail);
                $clef_stockage = decrypte($old_clef, $clef_cryptee);
                
                // et on la recrypte avec le nouveau mail
                $new_clef = custom_hash($login . $pass . $new_mail);
                $clef_recryptee = crypte($new_clef, $clef_stockage);
                
                $query_change = "
                    UPDATE `user`
                    SET
                        `mail_user` = '" . $new_mail . "',
                        `clef_user` = '" . $clef_recryptee . "'
                    WHERE
                        `login_user` = '" . $login . "'            
                ";
                
                if ($result = $mysqli->query($query_change)) {
                    status(200);
                    write_log([
                        "libelle" => "CHANGE MAIL",
                        "admin" => 0,
                        "query" => $query_change,
                        "statut" => 0,
                        "message" => "",
                        "erreur" => "",
                        "document" => "",
                        "objet" => $login
                    ]);
                } else {
                    status(500);
                    write_log([
                        "libelle" => "CHANGE MAIL",
                        "admin" => 0,
                        "query" => $query_change,
                        "statut" => 1,
                        "message" => "",
                        "erreur" => $mysqli->error,
                        "document" => "",
                        "objet" => $login
                    ]);
                }
            } else {
                status(403);
                $json = '{ "error": "pass" }';
                write_log([
                    "libelle" => "CHECK PASS",
                    "admin" => 0,
                    "query" => $query,
                    "statut" => 555,
                    "message" => "",
                    "erreur" => "pass",
                    "document" => "",
                    "objet" => $login
                ]);
            }
        } else {
            status(500);
            write_log([
                "libelle" => "CHECK PASS",
                "admin" => 0,
                "query" => $query,
                "statut" => 1,
                "message" => "",
                "erreur" => $mysqli->error,
                "document" => "",
                "objet" => $login
            ]);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "CHECK PASS",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $login
        ]);
    }

    header('Content-Type: application/json');
    echo $json;
} else {
    status(403);
    $json = '{ "error": "pass" }';
    write_log([
        "libelle" => "CHANGE PASS",
        "admin" => 0,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "pass",
        "document" => ""
    ]);
}
?>
