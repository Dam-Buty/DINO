<?php
session_start();
include("../includes/functions.php");  

if ($_SESSION["niveau"] >= 20) {
        
    try {
        $dino = new DINOSQL();
        
        $params = [
            "client" => $_SESSION["client"],
            "niveau" => $_SESSION["niveau"]
        ];
        
        $result = $dino->query("json_users", $params);
                
        $users = [];
        
        foreach($result as $row) {
            $users[$row["login_user"]] = [
                "mail" => $row["mail_user"],
                "niveau" => $row["niveau_user"],
                "token" => $row["fk_token"],
                "mondes" => []
            ];
            
            $params_mondes = [
                "user" => $row["login_user"],
                "client" => $_SESSION["client"],
                "user2" => $row["login_user"]
            ];
            
            $result_mondes = $dino->query("json_user_mondes", $params_mondes);
                    
            foreach($result_mondes as $row_mondes) {
                if ($row_mondes["niveau_monde"] <= $row["niveau_user"]
                    || $row_mondes["droit"] > 0 ) {
                        $users[$row["login_user"]]["mondes"][$row_mondes["pk_monde"]] = [];
                }
                
                $params_champs = [
                    "client" => $_SESSION["client"],
                    "monde" => $row_mondes["pk_monde"],
                    "user" => $row["login_user"]
                ];
                
                $result_champs = $dino->query("json_user_valeurs", $params_champs);
                                
                foreach($result_champs as $row_champs) {
                    array_push($users[$row["login_user"]]["mondes"][$row_mondes["pk_monde"]], $row_champs["fk_valeur_champ"]);
                }
            }
        }
        
        $json = json_encode($users);
        status(200);
        header('Content-Type: application/json');
        echo $json;
    } catch (Exception $e) {
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
