<?php
session_start();

if (isset($_SESSION["user"])) {
    include("../includes/PDO.php");
    include("../includes/log.php");
    include("../includes/crypt.php");
    include("../includes/status.php");

    $old_pass = $_POST["oldPass"];
    $new_pass = $_POST["newPass"];

    $login = $_SESSION["user"];

    $query = "SELECT `mdp_user`, `clef_user`, `mail_user` FROM `user` WHERE `login_user` = :login ;";
    
    $result = dino_query($query,[
        "login" => $login
    ]);

    if ($result["status"]) {
    
        $row = $result["result"][0];
        
        if ($row["mdp_user"] == custom_hash($old_pass . $login, TRUE)) {            
            // On décrypte la clef
            $clef_cryptee = $row["clef_user"];
            $old_clef = custom_hash($login . $old_pass . $row["mail_user"]);
            $clef_stockage = decrypte($old_clef, $clef_cryptee);
            
            // et on la recrypte avec le nouveau password
            $new_clef = custom_hash($login . $new_pass . $row["mail_user"]);
            $clef_recryptee = crypte($new_clef, $clef_stockage);
    
            $password = custom_hash($new_pass . $login, TRUE);
            
            $query_change = "
                UPDATE `user`
                SET
                    `mdp_user` = :pass,
                    `clef_user` = :clef
                WHERE
                    `login_user` = :login           
            ;";
            
            $result_change = dino_query($query_change, [
                "pass" => $password,
                "clef" => $clef_recryptee,
                "login" => $login
            ]);
            
            if ($result["status"]) {
                status(200);
                write_log([
                    "libelle" => "CHANGE PASS",
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
                    "libelle" => "CHANGE PASS",
                    "admin" => 0,
                    "query" => $query_change,
                    "statut" => 1,
                    "message" => $result["errinfo"][2],
                    "erreur" => $result["errno"],
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
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
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
