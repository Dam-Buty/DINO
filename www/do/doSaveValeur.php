<?php
session_start();
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    if ($_POST["pk"] == "new") {
        $query = "
            INSERT INTO `valeur_champ` (
                `label_valeur_champ`, 
                `fk_champ`, 
                `fk_monde`, 
                `fk_client`, 
                `fk_parent`
            ) VALUES (
                '" . $_POST["label"] . "',
                " . $_POST["champ"] . ",
                " . $_POST["monde"] . ",
                " . $_SESSION["client"] . ",
                " . $_POST["parent"] . "
            )
        ;";
    } else {
        $query = "
            UPDATE `valeur_champ`
            SET 
                `label_valeur_champ` = '" . $_POST["label"] . "'
            WHERE
                `fk_client` = " . $_SESSION["client"] . "
                AND `fk_monde` = " . $_POST["monde"] . "
                AND `fk_champ` = " . $_POST["champ"] . "
                AND `fk_parent` = " . $_POST["parent"] . "
                AND `pk_valeur_champ` = " . $_POST["pk"] . "
        ;";
    }
    
    if ($mysqli->query($query)) {
        status(200);
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
