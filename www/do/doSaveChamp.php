<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/PDO.php");
    
   
    $query = "
        UPDATE `champ`
        SET 
            `label_champ` = :label
        WHERE
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `pk_champ` = :champ
    ;";       
      
    $result = dino_query($query,[
        "label" => $_POST["label"],
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["pk"]
    ]);  
    
    if ($result["status"]) {
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
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
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
