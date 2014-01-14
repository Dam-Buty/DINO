<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if (isset($_SESSION["niveau"]) && $_SESSION["niveau"] >= 20 && $_SESSION["niveau"] > $_POST["niveau"]) {
    include("../includes/mysqli.php");
    include("../includes/crypt.php");
    include("../includes/mail.php");
    
    
    if ($_POST["pk"] == "new") {
        // Génération et cryptage de la clef de sécurité avec le login, le mdp et le mail_client
        
        $clef_user = custom_hash($_POST["login"] . $_POST["pass"] . $_POST["mail"]);
        $clef_stockage = $_SESSION["clef"];
        $clef_cryptee = crypte($clef_user, $clef_stockage);
        
        $password = custom_hash($_POST["pass"] . $_POST["login"], TRUE);

    #    echo "User : " . $clef_user . "<br/>";
    #    echo "Clef : <pre>" . $clef_stockage . "</pre>";
    
        $query_user = "
            INSERT INTO `user`
            (
                `login_user`, 
                `mdp_user`, 
                `mail_user`, 
                `niveau_user`, 
                `fk_client`, 
                `clef_user`
            ) VALUES (
                :login, 
                :password, 
                :mail, 
                :niveau, 
                :client, 
                :clef
            );";     
            
        $params_user = [
            "login" => $_POST["login"],
            "password" => $password,
            "mail" => $_POST["mail"],
            "niveau" => $_POST["niveau"],
            "client" => $_SESSION["client"],
            "clef" => $clef_cryptee
        ];
            
    } else {
        $query_user = "
            UPDATE `user`
            SET
                `niveau_user` = :niveau
            WHERE `login_user` = :login
        ;";
        
        $params_user = [
            "login" => $_POST["pk"],
            "niveau" => $_POST["niveau"]
        ];
    }
    
    $result_user = dino_query($query_user, $params_user);
    
    if ($result_user["status"]) {
        
        $query_del_droits == "
            DELETE FROM `user_monde`
                WHERE 
                    `fk_client` = :client
                    AND `fk_user` = :login
                    AND (
                        ";
                        
        $params_del_droits = [
            "client" => $_SESSION["client"],
            "login" => $_POST["login"]
        ];
        
        $first_droit = true;

        foreach($_POST["droits"] as $key => $monde) {
            if (!$first_droit) {
                $query_del_droits .= "
                        OR ";
            } else {
                $first_droit = false;
            }
            
            $query_del_droits .= "`fk_monde` = :monde" . $key;
            $params["monde" . $key] = $monde;
        }
                       
        $query_del_droits .=  "
                );";
        
        $result_del_droits = dino_query($query_del_droits, $params_del_droits);
         
        if ($result_del_droits["status"]) {
            
            $err = false;
            
            foreach($_POST["mondes"] as $monde => $valeurs) {    
                $query_insert_droits .= "
                    INSERT INTO `user_monde`
                    (`fk_client`, `fk_monde`, `fk_user`) 
                    VALUES (
                        :client,
                        :monde,
                        :login
                    );
                ";      
                        
                $params_insert_droits = [
                    "client" => $_SESSION["client"],
                    "monde" => $monde,
                    "login" => $_POST["login"]
                ];
                
                $result_insert_droits = dino_query($query_insert_droits, $params_insert_droits);
             
                if ($result_insert_droits["status"]) {
                    
                    $query_del_vc = "
                        DELETE FROM `user_valeur_champ`
                        WHERE 
                            `fk_client` = :client
                            AND `fk_monde` = :monde
                            AND `fk_champ` =  :champ
                            AND `fk_user` = :login ;
                    ";     
                        
                    $params_del_vc = [
                        "client" => $_SESSION["client"],
                        "monde" => $monde,
                        "champ" => $valeurs["champ"],
                        "login" => $_POST["login"]
                    ];
                    
                    $result_del_vc = dino_query($query_del_vc, $params_del_vc);
                 
                    if ($result_del_vc["status"]) {
                        foreach($valeurs["valeurs"] as $i => $valeur) {
                            $query_insert_vc .= "
                                INSERT INTO `user_valeur_champ`
                                (`fk_client`, `fk_monde`, `fk_champ`, `fk_user`, `fk_valeur_champ`) 
                                VALUES (
                                    " . $_SESSION["client"] . ",
                                    " . $monde . ",
                                    " . $valeurs["champ"] . ",
                                    '" . $_POST["login"] . "',
                                    " . $valeur . "
                                );
                            "; 
                        
                            $params_insert_vc = [
                                "client" => $_SESSION["client"],
                                "monde" => $monde,
                                "champ" => $valeurs["champ"],
                                "login" => $_POST["login"],
                                "valeur" => $valeur
                            ];
                            
                            $result_insert_vc = dino_query($query_insert_vc, $params_insert_vc);
                 
                            if (!$result_insert_vc["status"]) {
                                status(500);
                                write_log([
                                    "libelle" => "UPDATE document a cleaner",
                                    "admin" => 0,
                                    "query" => $query_insert_vc,
                                    "statut" => 1,
                                    "message" => $result_insert_vc["errinfo"][2],
                                    "erreur" => $result_insert_vc["errno"],
                                    "document" => "",
                                    "objet" => $POST["document"]
                                ]);
                                $err = true;
                                break;
                            }
                        } // FIN FOREACH VALEURS
                        if ($err) {
                            break;
                        }
                    } else {
                        status(500);
                        write_log([
                            "libelle" => "UPDATE document a cleaner",
                            "admin" => 0,
                            "query" => $query_del_vc,
                            "statut" => 1,
                            "message" => $result_del_vc["errinfo"][2],
                            "erreur" => $result_del_vc["errno"],
                            "document" => "",
                            "objet" => $POST["document"]
                        ]);
                        $err = true;
                        break;
                    }
                } else {
                    status(500);
                    write_log([
                        "libelle" => "UPDATE document a cleaner",
                        "admin" => 0,
                        "query" => $query_insert_droits,
                        "statut" => 1,
                        "message" => $result_insert_droits["errinfo"][2],
                        "erreur" => $result_insert_droits["errno"],
                        "document" => "",
                        "objet" => $POST["document"]
                    ]);
                    $err = true;
                    break;
                }
            } // FIN FOREACH MONDES
            
            if (!$err) {
                switch($_POST["niveau"]) {
                    case "0": 
                        $mail = "creation_visiteur";
                        break;
                    case "10":
                        $mail = "creation_archiviste";
                        break;
                    case "20":
                        $mail = "creation_admin";
                        break;
                }

                dinomail($_POST["mail"], $mail, [], [
                    "user" => $_POST["login"],
                    "client" => $_SESSION["nom_client"],
                    "pass" => $_POST["pass"]
                ]);
                
                
                status(200);
                write_log([
                    "libelle" => "INSERT user",
                    "admin" => 1,
                    "query" => $query,
                    "statut" => 0,
                    "message" => "",
                    "erreur" => "",
                    "document" => "",
                    "objet" => $_POST["login"]
                ]);
            }
        } else {
            status(500);
            write_log([
                "libelle" => "UPDATE document a cleaner",
                "admin" => 0,
                "query" => $query_del_droits,
                "statut" => 1,
                "message" => $result_del_droits["errinfo"][2],
                "erreur" => $result_del_droits["errno"],
                "document" => "",
                "objet" => $POST["document"]
            ]);
        }
    } else {
        status(500);
        write_log([
            "libelle" => "UPDATE document a cleaner",
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
    status(403);
    write_log([
        "libelle" => "INSERT user",
        "admin" => 1,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["login"]
    ]);
}
?>
