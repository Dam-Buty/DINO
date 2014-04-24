<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/DINOSQL.php");
    include("../includes/status.php");
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "client" => $_SESSION["client"],
            "login" => $_POST["login"]
        ];
        
        $dino->query("user_mondes_del_all", $params);
        
        $dino->query("user_valeurs_del_all", $params);
        
        $dino->query("user_tutos_del_all", [
            "login" => $_POST["login"]
        ]);
        
        $dino->query("delete_user",[
            "client" => $_SESSION["client"],
            "niveau" => $_SESSION["niveau"],
            "login" => $_POST["login"]
        ]);
        
        $dino->query("token_release", [
            "pk" => $_POST["token"]
        ]);
        
        $dino->commit();
        status(204);  
    } catch (Exception $e) {
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
