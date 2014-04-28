<?php
session_start();
include("../includes/log.php");
include("../includes/status.php");

if ($_SESSION["niveau"] >= 20) {
    include("../includes/DINOSQL.php");
    include("../includes/crypt.php");
    include("../includes/mail.php");
    
    // On génère un nouveau mot de passe
    $pass = genere_clef(10);
    
    $clef_user = custom_hash($_POST["login"] . $pass . $_POST["mail"]);
    $clef_stockage = $_SESSION["clef"];
    $clef_cryptee = crypte($clef_user, $clef_stockage);

    $password_stockable = custom_hash($pass . $_POST["login"], TRUE);
    
        
    try {
        $dino = new DINOSQL();
        
        $dino->query("key_user", [
            "pass" => $password_stockable,
            "clef" => $clef_cryptee,
            "client" => $_SESSION["client"],
            "niveau" => $_SESSION["niveau"],
            "login" => $_POST["login"]
        ]);
        $dino->commit();
        
        dinomail($_POST["mail"], "reset_pass", [], [
            "user" => $_POST["login"],
            "pass" => $pass
        ]);   
        
        status(200);
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Key user : droits insuffisants"
    ]);
    status(403);
}
?>
