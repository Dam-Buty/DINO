<?php
session_start();
if ($_SESSION["niveau"] > 20) {
    include("../includes/log.php");
    include("../includes/mysqli.php");
    
    $niveaux = array("Cliente", "Ejecutivo", "Administrador", "Gerente");
    
    $first = 1;
    
    $json = "";
    
    $query = "SELECT `login_user`, `mail_user`, `niveau_user`, `fk_interlocuteur`, (SELECT GROUP_CONCAT(`valeur_champ` SEPARATOR ', ') FROM `user_champ` as `uc` WHERE `u`.`login_user` = `uc`.`login_user`) AS `valeurs_champs` FROM `user` as `u` WHERE `fk_client` = " . $_SESSION["client"] . ";";
    
    if ($result = $mysqli->query($query)) {
        while ($row = $result->fetch_assoc()) {
            if ($json == "") {
                $json .= "[ ";
            } else {
                $json .= ',';
            }
            $json .= '{"action": "", ';
            $json .= '"user" : "' . $row["login_user"] . '", ';
            $json .= '"mail" : "' . $row["mail_user"] . '", ';
            $json .= '"type" : { "display" : "' . $niveaux[round($row["niveau_user"] / 10, 0, PHP_ROUND_HALF_DOWN)] . '", "value": "' . $row["niveau_user"] . '" }, ';
            
            if ($row["niveau_user"] > 20) {
                $json .= '"detail" : ""';
            } elseif ($row["niveau_user"] > 10) {
                $json .= '"detail" : "' . $row["valeurs_champs"] . '"';
            } else {
                $json .= '"detail" : "' . $row["fk_interlocuteur"] . '"';
            }
            
            $json .= "}";
        }        
        $result->free();
        $json .= "]";
    } else {
        $json = '{ "error": "mysqli", "message": "' . $mysqli->error . '", "query": "' . $query . '"}';
    }
    header('Content-Type: application/json');
    echo $json;   
}
?>
