<?php
include("../includes/functions.php");

$login = $_POST["login"];
$password = $_POST["password"];

try {
    $dino = new DINOSQL();
    
    $result = $dino->query("login",[
        "login" => $login
    ]);
    
    if (count($result) > 0) {
        $row = $result[0];
        
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
                    $clef_client = crypte_sym($clef_stockage);
                    
                    $dino->query("signup_user_clef", [
                        "client" => $row["client"],
                        "clef" => $clef_client
                    ]);
                    
                    $_SESSION["clef"] = $clef_stockage;
                    $dino->commit();
                    status(200);
                } else {
                    // Si le token a expiré mais n'a pas été flaggé
                    if ($row["hasExpired"] == 1 && $row["expired_token"] == 0) {
                        $params_expire = [
                            "pk" => $row["pk_token"]
                        ];
                        
                        $result_expire = $dino->query("expire_token", $params_expire);                    
                        $dino->commit();
                        status(402);
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
    
} catch (Exception $e) {
    debug(var_export($e));
    $dino->rollback();
    status(500);
}

?>
