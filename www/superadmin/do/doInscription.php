<?php
session_start();
if (isset($_SESSION["superadmin"])) {
    include("../../includes/mysqli.php");
    include("../../includes/crypt.php");

    $query_client = "INSERT INTO `client` (`entreprise_client`, `mail_client`, `nom_contact_client`, `poste_contact_client`, `phone_contact_client`, `bucket_client`, `credit_client`, `fk_profil`) VALUES ('" . $_POST["entreprise"] . "', '" . $_POST["mail"] . "', '" . $_POST["nom_contact"] . "', '" . $_POST["poste_contact"] . "', '" . $_POST["phone_contact"] . "', '" . $_POST["bucket"] . "', " . $_POST["credit"] . ", " . $_POST["profil"] . ");";
    
    if ($mysqli->query($query_client)) {
        $query_user = "INSERT INTO `user` (`login_user`, `mdp_user`, `mail_user`, `niveau_user`, `fk_client`, `clef_user`) VALUES ('" . $_POST["login"] . "', '" . $_POST["password"] . "', '" . $_POST["mail"] . "', 30, " . $mysqli->insert_id . ", '" . $_POST["clef_user"] . "');";
        
        if ($mysqli->query($query_user)) {
            header("Location: ../index.php");
        } else {
            echo $mysqli->error;
        }
    } else {
        echo $mysqli->error;
    }
}
?>
