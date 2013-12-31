<?php
session_start();
include("../includes/log.php");

if ($_SESSION["niveau"] >= 10) {
    include("../includes/mysqli.php");
    include("../includes/status.php");    
    
    $query = "
        INSERT INTO `valeur_champ`
        (`fk_client`, `fk_monde`, `fk_champ`, `fk_parent`, `label_valeur_champ`)
        VALUES (" . $_SESSION["client"] . ", " . $_POST["monde"] . ", " . $_POST["champ"] . ", " . $_POST["parent"] . ", '" . $_POST["valeur"] . "');";
        
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = '{ "pk": "' . $mysqli->insert_id . '" }';
        
        write_log([
            "libelle" => "INSERT valeur de champ",
            "admin" => 0,
            "query" => $query,
            "statut" => 0,
            "message" => "",
            "erreur" => "",
            "document" => "",
            "objet" => $mysqli->insert_id,
            "mysqli" => $mysqli
        ]);
        
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
        write_log([
            "libelle" => "INSERT valeur de champ",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => 0,
            "mysqli" => $mysqli
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "INSERT valeur de champ",
        "admin" => 0,
        "query" => "",
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => 0,
        "mysqli" => $mysqli
    ]);
}

?>
