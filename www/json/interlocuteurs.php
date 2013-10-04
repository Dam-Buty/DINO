<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/log.php");
    include("../includes/mysqli.php");

    $first = 1;
    
    $json = '[';
    
    $query = "SELECT `pk_interlocuteur`, `nom_interlocuteur` FROM `interlocuteur` ORDER BY `nom_interlocuteur` ASC;";
    
    if ($result = $mysqli->query($query)) {
        while ($row = $result->fetch_assoc()) {
            if (!$first) {
                $json .= ',';
            } else {
                $first = 0;            
            }
            
            $json .= '{ "pk" : "' . $row["pk_interlocuteur"] . '", "nom" : "' . $row["nom_interlocuteur"] . '" }';
        }
        $result->free();
        $json .= "]";
    } else {
        $json .= '"error" : "' . $mysqli->error . '"';
        $json .= "]";
    }
    header('Content-Type: application/json');
    echo $json;   
}


?>
