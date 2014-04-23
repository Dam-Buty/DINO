<?php
include("../includes/PDO.php");
include("../includes/log.php");
include("../includes/crypt.php");
include("../includes/status.php");

$login = $_POST["login"];
$password = $_POST["password"];

$result = dino_query("login",[
    "login" => $login
]);

if ($result["status"]) {
    if (count($result["result"]) > 0) {
        $row = $result["result"][0];
        
        if ($row["mdp_user"] == custom_hash($password . $login, TRUE)) {
            if ($row["activation_user"] == "") {
                if ($row["expired_token"] == 0 && $row["expired_user"] == 0 && $row["hasExpired"] == 0) {
                    session_start();
                    $_SESSION["user"] = $login;
                    $_SESSION["niveau"] = $row["niveau_user"];
                    
                    // On décrypte la clef
                    $clef_cryptee = $row["clef_user"];
                    $clef_user = custom_hash($login . $password . $row["mail_user"]);
                    
                    $clef_stockage = decrypte($clef_user, $clef_cryptee);
                    
                    $_SESSION["clef"] = $clef_stockage;
                    
                    status(200);
                } else {
                    // Si le token a expiré mais n'a pas été flaggé
                    if ($row["hasExpired"] == 1 && $row["expired_token"] == 0) {
                        $params_expire = [
                            "pk" => $row["pk_token"]
                        ];
                        
                        $result_expire = dino_query("expire_token", $params_expire);
                        if ($result_expire["status"]) {
                            status(402);
                        } else {
                            status(500);
                        }
                    } else {
                        status(402);
                    }
                }
            } else {
                status(403);
                $json = json_encode([
                    "error" => "activate"
                ]);
                header('Content-Type: application/json');
                echo $json;
            }
        } else {
            status(403);
            $json = json_encode([
                "error" => "pass"
            ]);
            header('Content-Type: application/json');
            echo $json;
        }
    } else {
        status(403);
        $json = json_encode([
            "error" => "login"
        ]);
        header('Content-Type: application/json');
        echo $json;
    }
} else {
    status(500);
}
?>
