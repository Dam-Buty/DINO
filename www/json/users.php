<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php"); 
        
    $params = [
        "client" => $_SESSION["client"],
        "niveau" => $_SESSION["niveau"]
    ];
    
    $result = dino_query("json_users", $params);
    
    if ($result["status"]) {
        
        $users = [];
        
        foreach($result["result"] as $row) {
            $users[$row["login_user"]] = [
                "mail" => $row["mail_user"],
                "niveau" => $row["niveau_user"],
                "mondes" => []
            ];
            
            $params_mondes = [
                "user" => $row["login_user"],
                "client" => $_SESSION["client"],
                "user2" => $row["login_user"]
            ];
            
            $result_mondes = dino_query("json_user_mondes", $params_mondes);
            
            if ($result_mondes["status"]) {
            
                foreach($result_mondes["result"] as $row_mondes) {
                    if ($row_mondes["niveau_monde"] <= $row["niveau_user"]
                        || $row_mondes["droit"] > 0 ) {
                            $users[$row["login_user"]]["mondes"][$row_mondes["pk_monde"]] = [];
                    }
                    
                    $params_champs = [
                        "client" => $_SESSION["client"],
                        "monde" => $row_mondes["pk_monde"],
                        "user" => $row["login_user"]
                    ];
                    
                    $result_champs = dino_query("json_user_valeurs", $params_champs);
                    
                    if ($result_champs["status"]) {
                        
                        foreach($result_champs["result"] as $row_champs) {
                            array_push($users[$row["login_user"]]["mondes"][$row_mondes["pk_monde"]], $row_champs["fk_valeur_champ"]);
                        }
                    }
                }
            } 
        }
        
        $json = json_encode($users);
        status(200);
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "JSON users : droits insuffisants"
    ]);
    status(403);
}

?>
