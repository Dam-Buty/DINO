<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    if ($_POST["pk"] == "new") {
        $query = "INSERT INTO `type_doc` (`label_type_doc`, `detail_type_doc`, `niveau_type_doc`, `fk_client`, `fk_monde`, `fk_categorie_doc`) VALUES ('" . $_POST["label"] . "', '" . $_POST["detail"]. "', '" . $_POST["niveau"] . "', '" . $_POST["client"] . "', '" . $_POST["monde"] . "', '" . $_POST["categorie"] . "');";
    } else {
        $query = "UPDATE `type_doc` SET `label_type_doc` = '" . $_POST["label"] . "', `detail_type_doc` = '" . $_POST["detail"] . "', `niveau_type_doc` = '" . $_POST["niveau"] . "' WHERE `pk_type_doc` = " . $_POST["pk"] . " AND `fk_client` = " . $_POST["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_categorie_doc` = " . $_POST["categorie"] . ";";
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
