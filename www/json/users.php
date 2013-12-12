<?php
session_start();

if (isset($_SESSION["niveau"]) >= 20) {
    include("../includes/mysqli.php");
    include("../includes/status.php");    
    
    $query = "SELECT `login_user`, `mail_user`, `niveau_user` FROM `user` WHERE `fk_client` = " . $_SESSION["client"] . " AND `niveau_user` < " . $_SESSION["niveau"] . ";";
    
    if ($result = $mysqli->query($query)) {
        
        $users = [];
        
        while ($row = $result->fetch_assoc()) {
            $users[$row["login_user"]] = [
                "mail" => $row["mail_user"],
                "niveau" => $row["niveau_user"],
                "regles" => []
            ];
            
            $query_regles = "
                SELECT `fk_champ`, `fk_valeur_champ` 
                FROM `user_valeur_champ`
                WHERE `fk_user` = '" . $row["login_user"] . "'
            ";
            
            if ($result_regles = $mysqli->query($query_regles)) {
                
                while ($row_regles = $result_regles->fetch_assoc()) {
                    if ($users[$row["login_user"]]["regles"][$row_regles["fk_champ"]] == null) {
                        $users[$row["login_user"]]["regles"][$row_regles["fk_champ"]] = [];
                    }
                    
                    // TODO : le problème est qu'on récupère le champ et non le monde
                    array_push($users[$row["login_user"]]["regles"][$row_regles["fk_champ"]], $row_regles["fk_valeur_champ"]);
                }
            }
        }
        
        $json = json_encode($users);
        status(200);
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
