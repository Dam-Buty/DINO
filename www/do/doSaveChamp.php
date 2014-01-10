<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    
   
    $query = "
        UPDATE `champ`
        SET 
            `label_champ` = '" . $_POST["label"] . "'
        WHERE
            `fk_client` = " . $_SESSION["client"] . "
            AND `fk_monde` = " . $_POST["monde"] . "
            AND `pk_champ` = " . $_POST["pk"] . "
    ;";
    
    if ($mysqli->query($query)) {
        status(200);
        write_log([
            "libelle" => "INSERT champ",
            "admin" => 1,
            "query" => $query,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $_POST["pk"]
        ]);
    } else {
        status(500);
        write_log([
            "libelle" => "INSERT champ",
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
        "libelle" => "INSERT champ",
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
