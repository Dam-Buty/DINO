<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if (isset($_SESSION["niveau"]) && $_SESSION["niveau"] >= 20 && $_SESSION["niveau"] > $_POST["niveau"]) {
    include("../includes/PDO.php");
    include("../includes/crypt.php");
    include("../includes/mail.php");
    
    $token = 0;
    
    // On vérifie d'abord le droit de créer / modifier l'user
    // si ça coute 1 token
    if ($_POST["solde"] == -1) {
        if ($_POST["token"] != 0) {                
            $params_token = [
                "pk" => $_POST["token"]
            ];
            
            $result_token = dino_query("token_user_check", $params_token);
            
            if ($result_token["status"]) {
                if (count($result_token["result"]) > 0) {
                    // Si c'est un visiteur gratuit
                    // on n'importe pas le token
                    if ($result_token["result"][0]["visitor"] == 1) {
                        $token = 0;
                    } else {
                        $token = $_POST["token"];
                    }
                
                } else {
                    status(402);
                    $err = true;
                }
            } else {
                status(500);
                $err = true;
            }
        } else {
            status(402);
            $err = true;
        }
    } else {
        if ($_POST["solde"] == 1) {
            $token = $_POST["token"];
        }
    }
    
    if ($_POST["pk"] == "new") {
        // Génération et cryptage de la clef de sécurité avec le login, le mdp et le mail_client
        
        $clef_user = custom_hash($_POST["login"] . $_POST["pass"] . $_POST["mail"]);
        $clef_stockage = $_SESSION["clef"];
        $clef_cryptee = crypte($clef_user, $clef_stockage);
        
        $password = custom_hash($_POST["pass"] . $_POST["login"], TRUE);

    #    echo "User : " . $clef_user . "<br/>";
    #    echo "Clef : <pre>" . $clef_stockage . "</pre>";
    
        $activation_user = genere_clef(12, true);
        
        $query_user = "user_add";
            
        $params_user = [
            "login" => $_POST["login"],
            "password" => $password,
            "mail" => $_POST["mail"],
            "niveau" => $_POST["niveau"],
            "client" => $_SESSION["client"],
            "activation" => $activation_user,
            "token" => $token,
            "clef" => $clef_cryptee
        ];
            
    } else {
        $query_user = "user_change";
        
        $params_user = [
            "login" => $_POST["pk"],
            "niveau" => $_POST["niveau"],
            "token" => $token
        ];
    }
    
    if (!$err) {
        $result_user = dino_query($query_user, $params_user);
        
        if ($result_user["status"]) {
                            
            $params_del_droits = [
                "client" => $_SESSION["client"],
                "login" => $_POST["login"]
            ];
            
            $result_del_droits = dino_query("user_droits_del_monde", $params_del_droits, [
                "droits" => $_POST["droits"]
            ]);
             
            if ($result_del_droits["status"]) {
                
                $err = false;
                
                foreach($_POST["mondes"] as $monde => $valeurs) {
                    $params_insert_droits = [
                        "client" => $_SESSION["client"],
                        "monde" => $monde,
                        "login" => $_POST["login"]
                    ];
                    
                    $result_insert_droits = dino_query("user_droits_monde", $params_insert_droits);
                 
                    if ($result_insert_droits["status"]) {                        
                        $params_del_vc = [
                            "client" => $_SESSION["client"],
                            "monde" => $monde,
                            "champ" => $valeurs["champ"],
                            "login" => $_POST["login"]
                        ];
                        
                        $result_del_vc = dino_query("user_droits_del_valeurs", $params_del_vc);
                     
                        if ($result_del_vc["status"]) {
                            foreach($valeurs["valeurs"] as $i => $valeur) {
                                $params_insert_vc = [
                                    "client" => $_SESSION["client"],
                                    "monde" => $monde,
                                    "champ" => $valeurs["champ"],
                                    "login" => $_POST["login"],
                                    "valeur" => $valeur
                                ];
                                
                                $result_insert_vc = dino_query("user_droits_add_valeurs", $params_insert_vc);
                     
                                if (!$result_insert_vc["status"]) {
                                    status(500);
                                    $err = true;
                                    break;
                                } 
                            } // FIN FOREACH VALEURS
                            if ($err) {
                                break;
                            }
                        } else {
                            status(500);
                            $err = true;
                            break;
                        }
                    } else {
                        status(500);
                        $err = true;
                        break;
                    }
                } // FIN FOREACH MONDES
                
                // On consomme le token ou on le rembourse
                if ($_POST["solde"] != 0) {
                    $params_token = [
                        "pk" => $token
                    ];
                    
                    if ($_POST["solde"] == -1) { 
                        $query = "token_use";
                    } else {
                        $query = "token_release";
                    }
                    
                    $result_token = dino_query($query, $params_token);
         
                    if (!$result_token["status"]) {
                        status(500);
                        $err = true;
                        break;
                    }    
                }
                
                if (!$err) {
                    // On envoie le mail si c'est une création
                    if ($_POST["pk"] == "new") {
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
                            "pass" => $_POST["pass"],
                            "mail" => $_POST["mail"],
                            "clef" => $activation_user
                        ]);
                    }
                        
                    status(200);
                }
            } else {
                status(500);
            }
        } else {
            status(500);
        }
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Save user : droits insuffisants"
    ]);
    status(403);
}
?>
