<?php
session_start();
include("../includes/status.php");
include("../includes/PDO.php");
include("../includes/log.php");

if (isset($_SESSION["niveau"])) {
    $query = "
        INSERT INTO `user_tuto` (
            `fk_user`,
            `fk_tuto`
        ) VALUES (
            :user,
            :tuto
        )
    ;";       
      
    $result = dino_query($query,[
        "login" => $_SESSION["user"],
        "tuto" => $_POST["tuto"]
    ]);  
    
    if ($result["status"]) {
        header("Location: ../index.php");
        write_log([
            "libelle" => "INSERT user tuto",
            "admin" => 1,
            "query" => $query,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $_SESSION["user"]
        ]);
    } else {
        header("Location: ../index.php");
        write_log([
            "libelle" => "INSERT user tuto",
            "admin" => 1,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_SESSION["user"]
        ]);
    }
} else {
    header("Location: ../index.php");
    write_log([
        "libelle" => "INSERT user tuto",
        "admin" => 1,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_SESSION["user"]
    ]);
}
?>
