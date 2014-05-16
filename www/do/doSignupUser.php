<?php
session_start();

include("../includes/functions.php");

// Génération et cryptage de la clef de sécurité avec le login, le mdp et le mail_client

$clef_user = custom_hash($_POST["mail"] . $_POST["pass"] . $_POST["mail"]);
$clef_stockage = genere_clef(32);
$clef_cryptee = crypte($clef_user, $clef_stockage);

$password = custom_hash($_POST["pass"] . $_POST["mail"], TRUE);

#        echo "User : " . $clef_user . "<br/>";
#        echo "Clef : <pre>" . $clef_stockage . "</pre>";

$_SESSION["user"] = $_POST["mail"];
$_SESSION["niveau"] = 30;
$_SESSION["clef"] = $clef_stockage;

try {
    $dino = new DINOSQL();
    
    // On crée le user gestionnaire
    $result_user = $dino->query("signup_user",[
        "login" => $_POST["mail"],
        "password" => $password,
        "mail" => $_POST["mail"],
        "idclient" => $_POST["client"],
        "clef" => $clef_cryptee
    ]);
    
    
    
#    debug($return);

    $dino->commit();
    status(200);
} catch (Exception $e) {
    $dino->rollback();
    status(500);
}
?>
