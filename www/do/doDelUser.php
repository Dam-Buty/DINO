<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    $query_user = "
        DELETE FROM `user`
        WHERE
            `fk_client` = :client
            AND `niveau_user` <= :niveau
            AND `login_user` = :login
    ;";
    
    $result = dino_query($query,[
        "client" => $_SESSION["client"],
        "niveau" => $_SESSION["niveau"],
        "login" => $_POST["login"]
    ]);
    
    if ($result["status"]) {
        status(204);
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
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_POST["login"]
        ]);
    }
} else {
    status(403);
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
