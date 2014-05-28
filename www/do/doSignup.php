<?php
session_start();
session_destroy();
session_start();

include("../includes/functions.php");

try {
    $dino = new DINOSQL();
    
    $result_check = $dino->query("check_client", [
        "mail" => $_POST["mail"]
    ]);

    $mail = "signup";
    
    if (count($result_check) == 0) { // nouvelle adresse
        
        // On crée le client avec seulement l'adresse mail
        $result_client = $dino->query("signup_client",[
            "mail" => $_POST["mail"]
        ]);

        $pk = $result_client;
        
        $_SESSION["client"] = $pk;

        chdir("../cache/");
        mkdir($pk);
        chdir($pk);
        mkdir("temp");
        chdir("..");

        $return = dinomail($_POST["mail"], $mail, [], [
            "mail" => urlencode($_POST["mail"]),
            "pk" => $pk
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
            "client" => $pk,
            "produit" => 3,
            "combo" => 1,
            "quantite" => 2000,
            "expire" => "3014-01-01",
            "paid" => 1
        ]);

        // 4 - Mondes 
        $dino->query("token_insert", [
            "client" => $pk,
            "produit" => 4,
            "combo" => 1,
            "quantite" => 1,
            "expire" => "3014-01-01",
            "paid" => 1
        ]);

        $dino->query("token_insert", [
            "client" => $pk,
            "produit" => 4,
            "combo" => 1,
            "quantite" => 1,
            "expire" => "3014-01-01",
            "paid" => 1
        ]);
    } else { // Client déjà signé
        $pk = $result_check[0]["pk"];
        
        $result_user = $dino->query("check_user", [
            "client" => $pk
        ]);
        
        if (count($result_user) == 0) { // Pas de user
            $return = dinomail($_POST["mail"], $mail, [], [
                "mail" => urlencode($_POST["mail"]),
                "pk" => $pk
            ]);
        } else { // user OK
            $mail = "signedup";
            
            $return = dinomail($_POST["mail"], $mail, [], [
                "mail" => urldecode($_POST["mail"])
            ]);
        }
    }
    
    $dino->commit();
    status(200);
    header('Content-Type: application/json');
    echo json_encode([
        "pk" => $pk    
    ]);
#    header("Location: ../welcome.php?action=signup&mail=" . $_POST["mail"]);
} catch (Exception $e) {
    $dino->rollback();
    status(500);
}
?>
