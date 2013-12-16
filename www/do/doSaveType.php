<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    
    if ($_POST["pk"] == "new") {
        $query = "
            INSERT INTO `type_doc` (
                `label_type_doc`, 
                `niveau_type_doc`,
                `detail_type_doc`,
                `fk_categorie_doc`,
                `fk_champ`, 
                `fk_monde`, 
                `fk_client`
            ) VALUES (
                '" . $_POST["label"] . "',
                " . $_POST["niveau"] . ",
                " . $_POST["detail"] . ",
                " . $_POST["categorie"] . ",
                " . $_POST["champ"] . ",
                " . $_POST["monde"] . ",
                " . $_SESSION["client"] . "
            )
        ;";
    } else {
        $query = "
            UPDATE `type_doc`
            SET 
                `label_type_doc` = '" . $_POST["label"] . "',
                `niveau_type_doc` = " . $_POST["niveau"] . ",
                `detail_type_doc` = " . $_POST["detail"] . "
            WHERE
                `fk_client` = " . $_SESSION["client"] . "
                AND `fk_monde` = " . $_POST["monde"] . "
                AND `fk_champ` = " . $_POST["champ"] . "
                AND `fk_categorie_doc` = " . $_POST["categorie"] . "
                AND `pk_type_doc` = " . $_POST["pk"] . "
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
            "libelle" => "INSERT type",
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
            "libelle" => "INSERT type",
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
        "libelle" => "INSERT type",
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
