<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");   
    
    $query = "
        SELECT 
            `login_user`, 
            `mail_user`, 
            `niveau_user` 
        FROM `user` 
        WHERE 
            `fk_client` = :client
            AND `niveau_user` < :niveau
    ;";
        
    $params = [
        "client" => $_SESSION["client"],
        "niveau" => $_SESSION["niveau"]
    ];
    
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        
        $users = [];
        
        foreach($result["result"] as $row) {
            $users[$row["login_user"]] = [
                "mail" => $row["mail_user"],
                "niveau" => $row["niveau_user"],
                "mondes" => []
            ];
                        
            $query_mondes = "
                SELECT 
                    `pk_monde`, 
                    `niveau_monde`,
                    (
                        SELECT COUNT(*)
                        FROM `user_monde` AS `um`
                        WHERE 
                            `um`.`fk_user` = :user
                            AND `um`.`fk_monde` = `pk_monde`
                    ) AS `droit`
                FROM `monde`
                WHERE 
                    `fk_client` = :client
                    AND (
                        SELECT COUNT(*)
                        FROM `user_monde` AS `um`
                        WHERE 
                            `um`.`fk_user` = :user2
                            AND `um`.`fk_monde` = `pk_monde`
                    ) = 1;
            ";
            
            $params_mondes = [
                "user" => $row["login_user"],
                "client" => $_SESSION["client"],
                "user2" => $row["login_user"]
            ];
            
            $result_mondes = dino_query($query_mondes, $params_mondes);
            
            if ($result_mondes["status"]) {
            
                foreach($result_mondes["result"] as $row_mondes) {
                    if ($row_mondes["niveau_monde"] <= $row["niveau_user"]
                        || $row_mondes["droit"] > 0 ) {
                            $users[$row["login_user"]]["mondes"][$row_mondes["pk_monde"]] = [];
                    }
                    
                    $query_champs = "
                        SELECT `fk_valeur_champ` 
                        FROM `user_valeur_champ`
                        WHERE 
                            `fk_client` = :client
                            AND `fk_monde` = :monde
                            AND `fk_user` = :user
                    ";
                    
                    $params_champs = [
                        "client" => $_SESSION["client"],
                        "monde" => $row_mondes["pk_monde"],
                        "user" => $row["login_user"]
                    ];
                    
                    $result_champs = dino_query($query_champs, $params_champs);
                    
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
        write_log([
            "libelle" => "GET liste users",
            "admin" => 1,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_SESSION["client"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "GET liste users",
        "admin" => 1,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_SESSION["client"]
    ]);
}

?>
