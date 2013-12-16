<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");   
    
    $query = "SELECT `login_user`, `mail_user`, `niveau_user` FROM `user` WHERE `fk_client` = " . $_SESSION["client"] . " AND `niveau_user` < " . $_SESSION["niveau"] . ";";
    
    if ($result = $mysqli->query($query)) {
        
        $users = [];
        
        while ($row = $result->fetch_assoc()) {
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
                            `um`.`fk_user` = '" . $row["login_user"] . "'
                            AND `um`.`fk_monde` = `pk_monde`
                    ) AS `droit`
                FROM `monde`
                WHERE 
                    `fk_client` = " . $_SESSION["client"] . "
                    AND (
                        SELECT COUNT(*)
                        FROM `user_monde` AS `um`
                        WHERE 
                            `um`.`fk_user` = '" . $row["login_user"] . "'
                            AND `um`.`fk_monde` = `pk_monde`
                    ) = 1;
            ";
            
            if ($result_mondes = $mysqli->query($query_mondes)) {
            
                while ($row_mondes = $result_mondes->fetch_assoc()) {
                    if ($row_mondes["niveau_monde"] <= $row["niveau_user"]
                        || $row_mondes["droit"] > 0 ) {
                            $users[$row["login_user"]]["mondes"][$row_mondes["pk_monde"]] = [];
                    }
                    
                    $query_champs = "
                        SELECT `fk_valeur_champ` 
                        FROM `user_valeur_champ`
                        WHERE 
                            `fk_client` = " . $_SESSION["client"] . "
                            AND `fk_monde` = " . $row_mondes["pk_monde"] . "
                            AND `fk_user` = '" . $row["login_user"] . "'
                    ";
                    
                    if ($result_champs = $mysqli->query($query_champs)) {
                        
                        while ($row_champs = $result_champs->fetch_assoc()) {
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
            "message" => "",
            "erreur" => $mysqli->error,
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
