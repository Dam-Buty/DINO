<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    include("../includes/status.php");    
    
    $query = "
        INSERT INTO `valeur_champ`
        (`fk_client`, `fk_monde`, `fk_champ`, `fk_parent`, `label_valeur_champ`)
        VALUES (" . $_SESSION["client"] . ", " . $_POST["monde"] . ", " . $_POST["champ"] . ", " . $_POST["parent"] . ", '" . $_POST["valeur"] . "');";
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = '{ "pk": "' . $mysqli->insert_id . '" }';
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
