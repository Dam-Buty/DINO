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
    
    $query_user = "
        UPDATE `user`
        SET 
            `mdp_user` = :pass,
            `clef_user` = :clef
        WHERE
            `fk_client` = :client
            AND `niveau_user` <= :niveau
            AND `login_user` = :login
    ;";
            
    $result_user = dino_query($query_user, [
        "pass" => $password_stockable,
        "clef" => $clef_cryptee,
        "client" => $_SESSION["client"],
        "niveau" => $_SESSION["niveau"],
        "login" => $_POST["login"]
    ]);
    
    if ($result_user["status"]) {
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
            "message" => $result_user["errinfo"][2],
            "erreur" => $result_user["errno"],
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
