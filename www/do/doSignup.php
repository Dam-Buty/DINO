<?php
session_start();

include("../includes/functions.php");

// Génération et cryptage de la clef de sécurité avec le login, le mdp et le mail_client

$clef_user = custom_hash($_POST["login"] . $_POST["pass"] . $_POST["mail"]);
$clef_stockage = genere_clef(32);
$clef_cryptee = crypte($clef_user, $clef_stockage);

$password = custom_hash($_POST["pass"] . $_POST["login"], TRUE);

#        echo "User : " . $clef_user . "<br/>";
#        echo "Clef : <pre>" . $clef_stockage . "</pre>";

try {
    $dino = new DINOSQL();
    
    // On crée le client avec seulement l'adresse mail
    $result_client = $dino->query("signup_client",[
        "mail" => $_POST["mail"]
    ]);

    $idclient = $result_client;

    $activation_user = genere_clef(12, true);

    // On crée le user gestionnaire
    $result_user = $dino->query("signup_user",[
        "login" => $_POST["login"],
        "password" => $password,
        "mail" => $_POST["mail"],
        "idclient" => $idclient,
        "clef" => $clef_cryptee,
        "activation" => $activation_user
    ]);

    chdir("../cache/"); // TODO : plutôt le faire à l'activation :)
    mkdir($idclient);
    chdir($idclient);
    mkdir("temp");
    chdir("..");

    $mail = "signup";
    
#    debug($_POST["mail"]);
#    debug($mail);

    $return = dinomail($_POST["mail"], $mail, [], [
        "user" => $_POST["login"],
        "pass" => $_POST["pass"],
        "mail" => urlencode($_POST["mail"]),
        "clef" => $activation_user
    ]);
    
#    debug($return);

    // Création des tokens du compte Starter          
    // 1 - User             
    $dino->query("token_insert", [
        "client" => $idclient,
        "produit" => 1,
        "combo" => 1,
        "quantite" => 1,
        "expire" => "3014-01-01",
        "paid" => 1
    ]);

    // 3 - Espace 
    $dino->query("token_insert", [
        "client" => $idclient,
        "produit" => 3,
        "combo" => 1,
        "quantite" => 2000,
        "expire" => "3014-01-01",
        "paid" => 1
    ]);

    // 4 - Mondes 
    $dino->query("token_insert", [
        "client" => $idclient,
        "produit" => 4,
        "combo" => 1,
        "quantite" => 1,
        "expire" => "3014-01-01",
        "paid" => 1
    ]);

    $dino->query("token_insert", [
        "client" => $idclient,
        "produit" => 4,
        "combo" => 1,
        "quantite" => 1,
        "expire" => "3014-01-01",
        "paid" => 1
    ]);

    $dino->commit();
    status(200);

    echo $idclient;
} catch (Exception $e) {
    $dino->rollback();
    status(500);
}
?>
