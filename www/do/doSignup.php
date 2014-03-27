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
        $query_client = "
            INSERT INTO `client` (
                `mail_client`
            ) VALUES (
                :mail
        );";

        $result_client = dino_query($query_client,[
            "mail" => $_POST["mail"]
        ]);

        if ($result_client["status"]) {
            $idclient = $result_client["result"];
            
            $activation_user = genere_clef(12, true);
            
            // On crée le user gestionnaire
            $query_user = "
                INSERT INTO `user` (
                    `login_user`, 
                    `mdp_user`, 
                    `mail_user`, 
                    `niveau_user`, 
                    `fk_client`, 
                    `clef_user`,
                    `activation_user`
                ) VALUES (
                    :login, 
                    :password, 
                    :mail, 
                    30, 
                    :idclient, 
                    :clef,
                    :activation
            );";
            
            $result_user = dino_query($query_user,[
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
                write_log([
                    "libelle" => "SIGNUP INSERT client + user",
                    "admin" => 0,
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
                    "libelle" => "INSERT user",
                    "admin" => 0,
                    "query" => $query_user,
                    "statut" => 1,
                    "message" => $result_user["errinfo"][2],
                    "erreur" => $result_user["errno"],
                    "document" => "",
                    "objet" => $POST["document"]
                ]);
            }
        } else {
            status(500);
            write_log([
                "libelle" => "INSERT client",
                "admin" => 0,
                "query" => $query_client,
                "statut" => 1,
                "message" => $result_client["errinfo"][2],
                "erreur" => $result_client["errno"],
                "document" => "",
                "objet" => ""
            ]);
        }
        break;
    case 2:
        $query_client = "
            UPDATE `client`
            SET
                `entreprise_client` = :entreprise,
                `secteur_client` = :secteur
            WHERE
                `pk_client` = :pk
        ;";

        $result_client = dino_query($query_client,[
            "entreprise" => $_POST["entreprise"],
            "secteur" => $_POST["secteur"],
            "pk" => $_POST["pk"]
        ]);

        if ($result_client["status"]) {
            status(200);
            echo $idclient;
            write_log([
                "libelle" => "UPDATE client",
                "admin" => 0,
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
                "libelle" => "UPDATE client",
                "admin" => 0,
                "query" => $query_client,
                "statut" => 1,
                "message" => $result_client["errinfo"][2],
                "erreur" => $result_client["errno"],
                "document" => "",
                "objet" => ""
            ]);
        }
        break;
};

?>
