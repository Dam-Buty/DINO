<?php
session_start();
include("../includes/status.php");

if (isset($_SESSION["user"])) {
    include("../includes/DINOSQL.php");
    include("../includes/log.php");
    include("../includes/crypt.php");

    $pass = $_POST["pass"];
    $new_mail = $_POST["mail"];

    $login = $_SESSION["user"];

    try {
        $dino = new DINOSQL();
        
        $result = $dino->query("change_mail_select",[
            "login" => $login
        ]);
    
        $row = $result[0];
        
        if ($row["mdp_user"] == custom_hash($pass . $login, TRUE)) {  
            $old_mail = $row["mail_user"];
            
            // On décrypte la clef
            $clef_cryptee = $row["clef_user"];
            $old_clef = custom_hash($login . $pass . $old_mail);
            $clef_stockage = decrypte($old_clef, $clef_cryptee);
            
            // et on la recrypte avec le nouveau mail
            $new_clef = custom_hash($login . $pass . $new_mail);
            $clef_recryptee = crypte($new_clef, $clef_stockage);
            
            $dino->query("change_mail_update",[
                "mail" => $new_mail,
                "clef" => $clef_recryptee,
                "login" => $login
            ]);
            
            $dino->commit();
            status(200);
        } else {
            status(403);
        }
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    status(403);
}
?>
