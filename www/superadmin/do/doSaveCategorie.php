<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    if ($_POST["pk"] == "new") {
        $query = "INSERT INTO `categorie_doc` (`label_categorie_doc`, `niveau_categorie_doc`, `fk_monde`, `fk_client`, `fk_champ`) VALUES ('" . $_POST["label"] . "', " . $_POST["niveau"]. ", " . $_POST["monde"] . ", " . $_POST["client"] . ", " . $_POST["champ"] . ");";
    } else {
        $query = "UPDATE `categorie_doc` SET `label_categorie_doc` = '" . $_POST["label"] . "', `niveau_categorie_doc` = " . $_POST["niveau"] . " WHERE `fk_monde` = " . $_POST["monde"] . " AND `fk_client` = " . $_POST["client"] . " AND `fk_champ` = " . $_POST["champ"] . " AND `pk_categorie_doc` = " . $_POST["pk"] . ";";
    }
    
    if ($mysqli->query($query)) {
        status(200);
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
        header('Content-Type: application/json');
        echo $json;
    }
}
?>
