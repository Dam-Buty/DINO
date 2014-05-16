<?php
session_start();

include("../includes/functions.php");

try {
    $dino = new DINOSQL();

    $activation_client = genere_clef(12, true);
    
    // On crée le client avec seulement l'adresse mail
    $result_client = $dino->query("signup_client",[
        "mail" => $_POST["mail"],
        "key" => $activation_client
    ]);

    $idclient = $result_client;
    
    $_SESSION["client"] = $idclient;

    chdir("../cache/");
    mkdir($idclient);
    chdir($idclient);
    mkdir("temp");
    chdir("..");

    $mail = "signup";

    $return = dinomail($_POST["mail"], $mail, [], [
        "mail" => urlencode($_POST["mail"]),
        "key" => $activation_client,
        "pk" => $idclient
    ]);

    // Création des tokens du compte Starter          
    // 1 - User             
#    $dino->query("token_insert", [
#        "client" => $idclient,
#        "produit" => 1,
#        "combo" => 1,
#        "quantite" => 1,
#        "expire" => "3014-01-01",
#        "paid" => 1
#    ]);

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
    header("Location: ../welcome.php?action=signup&mail=" . $_POST["mail"]);
} catch (Exception $e) {
    $dino->rollback();
    status(500);
}
?>
