<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php");
    include("../includes/status.php");
    
    $result_user = dino_query("delete_user",[
        "client" => $_SESSION["client"],
        "niveau" => $_SESSION["niveau"],
        "login" => $_POST["login"]
    ]);
    
    if ($result_user["status"]) {
        $params = [
            "client" => $_SESSION["client"],
            "login" => $_POST["login"]
        ];
        
        $result_user_mondes = dino_query("user_mondes_del_all", $params);
        
        if ($result_user_mondes["status"]) {
            $result_user_valeurs = dino_query("user_valeurs_del_all", $params);
        
            if ($result_user_valeurs["status"]) {
                $params = [
                    "login" => $_POST["login"]
                ];
                
                $result_user_tutos = dino_query("user_tutos_del_all", $params);
            
                if ($result_user_tutos["status"]) {
                    if ($_POST["token"] != 0) {
                        $params = [
                            "pk" => $_POST["token"]
                        ];
                        
                        $result_user_token = dino_query("token_release", $params);
                    
                        if ($result_user_token["status"]) {
                            status(204);
                        } else {
                            status(500);
                        }
                    } else {
                        status(204);
                    }
                } else {
                    status(500);
                }
            } else {
                status(500);
            }
        } else {
            status(500);
        }
    } else {
        status(500);
    } 
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Suppression d'user : droits insuffisants"
    ]);
    status(403);
}
?>
