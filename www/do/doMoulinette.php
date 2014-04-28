<?php
session_start();
include("../includes/log.php");
include("../includes/status.php");

if ($_SESSION["niveau"] == 999) {
    include("../includes/DINOSQL.php");
    include("../includes/crypt.php");
    include("../includes/mail.php");

    $login = $_POST["gestionnaire"];
    $password = $_POST["pass"];
    $mail = $_POST["mail"];
    $client = $_POST["client"];

    $users = $_POST["users"];

    try {
        $dino = new DINOSQL();
        
        $result = $dino->query("login",[
            "login" => $login
        ]);

        $row = $result[0];

        if ($row["mdp_user"] == custom_hash($password . $login, TRUE)) {        
            // On décrypte la clef
            $clef_cryptee = $row["clef_user"];
            $clef_user = custom_hash($login . $password . $mail);
            
            $clef_stockage = decrypte($clef_user, $clef_cryptee);
            
            $err = false;
            $nb_users = 0;
            
            foreach($users as $i => $user) {
                $pass_user = genere_clef(10);
                $pass_stockage = custom_hash($password . $user["login"], TRUE);
                
                $activation_user = genere_clef(12, true);
                
                $clef_user = custom_hash($user["login"] . $pass_user . $user["mail"]);
                
                $clef_cryptee = crypte($clef_user, $clef_stockage);
                
                $params_user = [
                    "login" => $user["login"],
                    "password" => $pass_stockage,
                    "mail" => $user["mail"],
                    "niveau" => 10,
                    "client" => $client,
                    "activation" => $activation_user,
                    "clef" => $clef_cryptee
                ];
                
                $dino->query("user_add", $params_user);
                
                foreach($user["mondes"] as $j => $monde) {
                    $params_monde = [
                        "client" => $client,
                        "monde" => $monde,
                        "login" => $user["login"]
                    ];
                    
                    $result_monde = $dino->query("user_droits_monde", $params_monde);
                    // TODO expos : aussi ajouter une valeur de champ à chaque monde avec le nom de l'exposant et lui donner les droits sur celle ci
                    $nb_users++;
                    
                    dinomail($user["mail"], "creation_archiviste", [], [
                        "user" => $user["login"],
                        "pass" => $pass_user,
                        "mail" => $user["mail"],
                        "clef" => $activation_user
                    ]);
                }
            }
              
            $dino->commit();
            status(200);    
            echo $nb_users;
        } else {
            status(403);
        }
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Petit pédé se prend pour un superadmin!"
    ]);
    status(403);
}
?>
