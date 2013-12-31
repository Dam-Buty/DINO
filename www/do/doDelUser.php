<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    $query_user = "
        DELETE FROM `user`
        WHERE
            `fk_client` = " . $_SESSION["client"] . "
            AND `niveau_user` <= " . $_SESSION["niveau"] . "
            AND `login_user` = '" . $_POST["login"] . "'
    ;";
    
    if ($mysqli->query($query_user)) {
        status(200);
        write_log([
            "libelle" => "DELETE utilisateur",
            "admin" => 1,
            "query" => $query_user,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $_POST["login"]
        ]);
    } else {
        status(500);
        write_log([
            "libelle" => "DELETE utilisateur",
            "admin" => 1,
            "query" => $query_user,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $_POST["login"]
        ]);
    }
} else {
    header("Location: ../index.php");
    write_log([
        "libelle" => "DELETE utilisateur",
        "admin" => 1,
        "query" => $query_user,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["login"]
    ]);
}
?>
