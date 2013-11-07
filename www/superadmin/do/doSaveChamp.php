<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    if ($_POST["pk"] == "new") {
        $query = "INSERT INTO `champ` (`fk_monde`, `fk_client`, `label_champ`, `pluriel_champ`) VALUES (" . $_POST["monde"] . ", " . $_POST["client"] . ", '" . $_POST["label"] . "', '" . $_POST["pluriel"]. "');";
    } else {
        $query = "UPDATE `champ` SET `label_champ` = '" . $_POST["label"] . "', `pluriel_champ` = '" . $_POST["pluriel"] . "' WHERE `pk_champ` = " . $_POST["pk"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_client` = " . $_POST["client"] . ";";
    }
    
    if ($mysqli->query($query)) {
            status(200);        
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
