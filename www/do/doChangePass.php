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
    
    $result = dino_query("change_mdp_select",[
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
            
            $result_change = dino_query("change_mdp_update", [
                "pass" => $password,
                "clef" => $clef_recryptee,
                "login" => $login
            ]);
            
            if ($result["status"]) {
                status(200);
            } else {
                status(500);
            }
        } else {
            status(403);
            $json = '{ "error": "pass" }';
            header('Content-Type: application/json');
            echo $json;
        }
    } else {
        status(500);
    }
} else {
    status(403);
    $json = '{ "error": "pass" }';
    header('Content-Type: application/json');
    echo $json;
}

?>
