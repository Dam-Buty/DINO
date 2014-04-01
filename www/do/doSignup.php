<?php
session_start();

include("../includes/PDO.php");
include("../includes/log.php");
include("../includes/crypt.php");
include("../includes/mail.php");
include("../includes/status.php");

switch($_POST["page"]) {
    case 1:
        // Génération et cryptage de la clef de sécurité avec le login, le mdp et le mail_client

        $clef_user = custom_hash($_POST["login"] . $_POST["pass"] . $_POST["mail"]);
        $clef_stockage = genere_clef(32);
        $clef_cryptee = crypte($clef_user, $clef_stockage);

        $password = custom_hash($_POST["pass"] . $_POST["login"], TRUE);

#        echo "User : " . $clef_user . "<br/>";
#        echo "Clef : <pre>" . $clef_stockage . "</pre>";

        // On crée le client avec seulement l'adresse mail
        $result_client = dino_query("signup_client",[
            "mail" => $_POST["mail"]
        ]);

        if ($result_client["status"]) {
            $idclient = $result_client["result"];
            
            $activation_user = genere_clef(12, true);
            
            // On crée le user gestionnaire
            $result_user = dino_query("signup_user",[
                "login" => $_POST["login"],
                "password" => $password,
                "mail" => $_POST["mail"],
                "idclient" => $idclient,
                "clef" => $clef_cryptee,
                "activation" => $activation_user
            ]);
            
            if ($result_user["status"]) {
                chdir("../cache/"); // TODO : plutôt le faire à l'activation :)
                mkdir($idclient);
                chdir($idclient);
                mkdir("temp");
                
                $mail = "signup";
                
                dinomail($_POST["mail"], $mail, [], [
                    "user" => $_POST["login"],
                    "pass" => $_POST["pass"],
                    "mail" => $_POST["mail"],
                    "clef" => $activation_user
                ], true);
                
                status(200);
                echo $idclient;
            } else {
                status(500);
            }
        } else {
            status(500);
        }
        break;
};

?>
