<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    if ($_POST["presence"] == 1) {
        $query = "DELETE FROM `monde_champ` WHERE `fk_monde` = " . $_POST["monde"] . " AND `fk_client` = " . $_POST["client"] . " AND `fk_champ` = " . $_POST["pk"] . ";";
    } else {
        $query = "INSERT INTO `monde_champ` (`fk_monde`, `fk_client`, `fk_champ`) VALUES (" . $_POST["monde"] . ", " . $_POST["client"] . ", " . $_POST["pk"] . ");";
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
