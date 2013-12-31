<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    
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
        
        if ($_POST["pk"] == "new") {
            $objet = $mysqli->insert_id;
        } else {
            $objet = $_POST["pk"];
        }
        
        write_log([
            "libelle" => "INSERT valeur",
            "admin" => 1,
            "query" => $query,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $objet
        ]);
    } else {
        status(500);
        write_log([
            "libelle" => "INSERT valeur",
            "admin" => 1,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $_POST["pk"]
        ]);
    }
    
} else {
    status(403);
    write_log([
        "libelle" => "INSERT valeur",
        "admin" => 1,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["pk"]
    ]);
}
?>
