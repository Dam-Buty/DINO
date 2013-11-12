<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    include("../includes/status.php");    
    
    $query = "SELECT `pk_valeur_champ`, `label_valeur_champ` FROM `valeur_champ` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_parent` = " . $_POST["parent"] . ";";
    
    if ($result = $mysqli->query($query)) {
        
        $valeurs = [];
        
        while ($row = $result->fetch_assoc()) {
            $valeurs[$row["pk_valeur_champ"]] = $row["label_valeur_champ"];
        }
        
        $json = json_encode($valeurs);
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
