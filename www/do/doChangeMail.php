<?php
session_start();

if (isset($_SESSION["user"])) {
    include("../includes/PDO.php");
    include("../includes/log.php");
    include("../includes/crypt.php");
    include("../includes/status.php");

    $pass = $_POST["pass"];
    $new_mail = $_POST["mail"];

    $login = $_SESSION["user"];
    
    $result = dino_query("change_mail_select",[
        "login" => $login
    ]);

    if ($result["status"]) {
    
        $row = $result["result"][0];
        
        if ($row["mdp_user"] == custom_hash($pass . $login, TRUE)) {  
            $old_mail = $row["mail_user"];
            
            // On décrypte la clef
            $clef_cryptee = $row["clef_user"];
            $old_clef = custom_hash($login . $pass . $old_mail);
            $clef_stockage = decrypte($old_clef, $clef_cryptee);
            
            // et on la recrypte avec le nouveau mail
            $new_clef = custom_hash($login . $pass . $new_mail);
            $clef_recryptee = crypte($new_clef, $clef_stockage);
            
            $result_change = dino_query("change_mail_update",[
                "mail" => $new_mail,
                "clef" => $clef_recryptee,
                "login" => $login
            ]);
            
            if ($result_change["status"]) {
                status(200);
            } else {
                status(500);
            }
        } else {
            status(403);
            $json = '{ "error": "pass" }';
        }
    } else {
        status(500);
    }

    header('Content-Type: application/json');
    echo $json;
} else {
    status(403);
    $json = '{ "error": "pass" }';
}
?>
