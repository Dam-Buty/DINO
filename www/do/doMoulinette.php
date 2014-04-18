<?php
include("../includes/PDO.php");
include("../includes/log.php");
include("../includes/crypt.php");
include("../includes/status.php");
include("../includes/mail.php");

$login = $_POST["gestionnaire"];
$password = $_POST["pass"];
$mail = $_POST["mail"];
$client = $_POST["client"];

$users = $_POST["users"];

$result = dino_query("login",[
    "login" => $login
]);

if ($result["status"]) {
    $row = $result["result"][0];
    
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
            
            $result_user = dino_query("user_add", $params_user);
            
            if ($result_user["status"]) {
                foreach($user["mondes"] as $j => $monde) {
                    $params_monde = [
                        "client" => $client,
                        "monde" => $monde,
                        "login" => $user["login"]
                    ];
                    
                    $result_monde = dino_query("user_droits_monde", $params_monde);
                    
                    if ($result_monde["status"]) {
                        $nb_users++;
                    } else {
                        $err = true;
                    }
            
                    if ($err) {
                        break;
                    }
                }
            } else {
                $err = true;
            }
            
            if ($err) {
                break;
            } else {
                dinomail($user["mail"], "creation_archiviste", [], [
                    "user" => $user["login"],
                    "pass" => $pass_user,
                    "mail" => $user["mail"],
                    "clef" => $activation_user
                ]);
            }
        }
        
        if ($err) {
            status(500);
        } else {
            status(200);
        }
        
        echo $nb_users;
    } else {
        status(403);
        $json = json_encode([
            "error" => "pass"
        ]);
        header('Content-Type: application/json');
        echo $json;
    }
} else {
    status(500);
}
?>
