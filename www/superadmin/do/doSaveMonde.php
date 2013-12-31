<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    if ($_POST["pk"] == "new") {
        $query = "INSERT INTO `monde` (`label_monde`, `niveau_monde`, `fk_client`) VALUES ('" . $_POST["label"] . "', '" . $_POST["niveau"] . "', '" . $_POST["client"] . "');";
    } else {
        $query = "UPDATE `monde` SET `label_monde` = '" . $_POST["label"] . "', `niveau_monde` = '" . $_POST["niveau"] . "' WHERE `pk_monde` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . ";";
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
