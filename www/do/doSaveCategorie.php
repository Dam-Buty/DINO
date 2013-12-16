<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    
    if ($_POST["pk"] == "new") {
        $query = "
            INSERT INTO `categorie_doc` (
                `label_categorie_doc`, 
                `niveau_categorie_doc`,
                `fk_champ`, 
                `fk_monde`, 
                `fk_client`
            ) VALUES (
                '" . $_POST["label"] . "',
                " . $_POST["niveau"] . ",
                " . $_POST["champ"] . ",
                " . $_POST["monde"] . ",
                " . $_SESSION["client"] . "
            )
        ;";
    } else {
        $query = "
            UPDATE `categorie_doc`
            SET 
                `label_categorie_doc` = '" . $_POST["label"] . "',
                `niveau_categorie_doc` = " . $_POST["niveau"] . "
            WHERE
                `fk_client` = " . $_SESSION["client"] . "
                AND `fk_monde` = " . $_POST["monde"] . "
                AND `fk_champ` = " . $_POST["champ"] . "
                AND `pk_categorie_doc` = " . $_POST["pk"] . "
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
            "libelle" => "INSERT categorie",
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
            "libelle" => "INSERT categorie",
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
    header("Location: ../index.php");
    write_log([
        "libelle" => "INSERT categorie",
        "admin" => 1,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["pk"]
    ]);
}
?>
