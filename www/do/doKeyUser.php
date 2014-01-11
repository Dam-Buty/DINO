<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    include("../includes/crypt.php");
    include("../includes/status.php");
    include("../includes/mail.php");
    
    // On génère un nouveau mot de passe
    $pass = genere_clef(10);
    //$pass = "C4dillac5";
    
    $clef_user = custom_hash($_POST["login"] . $pass . $_POST["mail"]);
    $clef_stockage = $_SESSION["clef"];
    $clef_cryptee = crypte($clef_user, $clef_stockage);

    $password_stockable = custom_hash($pass . $_POST["login"], TRUE);
    
    $query_user = "
        UPDATE `user`
        SET 
            `mdp_user` = '" . $password_stockable . "',
            `clef_user` = '" . $clef_cryptee . "'
        WHERE
            `fk_client` = " . $_SESSION["client"] . "
            AND `niveau_user` <= " . $_SESSION["niveau"] . "
            AND `login_user` = '" . $_POST["login"] . "'
    ;";
    
    if ($mysqli->query($query_user)) {
        // mail($_POST["mail"] , "Su contrasena fue reinicialisada!" , "Su nueva contrasena : " . $pass );
        // MAIL !
        
        dinomail($_POST["mail"], "reset_pass", [], [
            "user" => $_POST["login"],
            "pass" => $pass
        ]);
        
        status(200);
        write_log([
            "libelle" => "RESET mot de passe",
            "admin" => 1,
            "query" => $query_user,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $_POST["login"]
        ]);
    } else {
        status(500);
        write_log([
            "libelle" => "RESET mot de passe",
            "admin" => 1,
            "query" => $query_user,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $_POST["login"]
        ]);
    }
    
} else {
    header("Location: ../index.php");
    write_log([
        "libelle" => "RESET mot de passe",
        "admin" => 1,
        "query" => $query_user,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["login"]
    ]);
}
?>
