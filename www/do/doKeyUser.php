<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php");
    include("../includes/crypt.php");
    include("../includes/status.php");
    include("../includes/mail.php");
    
    // On génère un nouveau mot de passe
    $pass = genere_clef(10);
    
    $clef_user = custom_hash($_POST["login"] . $pass . $_POST["mail"]);
    $clef_stockage = $_SESSION["clef"];
    $clef_cryptee = crypte($clef_user, $clef_stockage);

    $password_stockable = custom_hash($pass . $_POST["login"], TRUE);
    
    $result_user = dino_query("key_user", [
        "pass" => $password_stockable,
        "clef" => $clef_cryptee,
        "client" => $_SESSION["client"],
        "niveau" => $_SESSION["niveau"],
        "login" => $_POST["login"]
    ]);
    
    if ($result_user["status"]) {
        $retour = dinomail($_POST["mail"], "reset_pass", [], [
            "user" => $_POST["login"],
            "pass" => $pass
        ]);
        
                    
        if ($retour != "") {
            dino_log([
                "niveau" => "E",
                "query" => "mail reset_pass",
                "errno" => "",
                "errinfo" => $retour,
                "params" => json_encode([
                    "user" => $_POST["login"],
                    "pass" => $pass
                ])
            ]);
        }
        
        status(200);
    } else {
        status(500);
    }
    
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Key user : droits insuffisants"
    ]);
    header("Location: ../index.php");
}
?>
