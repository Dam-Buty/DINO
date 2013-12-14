<?php
session_start();
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    $query = "
        SELECT `filename_document`
        FROM `document` AS `d`, `document_valeur_champ` AS `dvc`
        WHERE 
            `d`.`fk_client` = " . $_SESSION["client"] . "
            
            AND `dvc`.`fk_client` = " . $_SESSION["client"] . "
            AND `dvc`.`fk_monde` = " . $_POST["monde"] . "
            AND `dvc`.`fk_champ` = " . $_POST["champ"] . "
            AND `dvc`.`fk_valeur_champ` = " . $_POST["pk"] . "
            
            AND `d`.`filename_document` = `dvc`.`fk_document`
    ;";
    if ($res = $mysqli->query($query)) {
        status(200);
        $json = $res->num_rows;
    } else {
        status(500);
        $json = '{ "error": "mysql", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }

    header('Content-Type: application/json');
    echo $json;
} else {
    header("Location: ../index.php");
}
?>
