<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");  
    
    $query = "SELECT `pk_valeur_champ`, `label_valeur_champ` FROM `valeur_champ` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_parent` = " . $_POST["parent"] . " AND `fk_champ` = " . $_POST["champ"] . ";";
    
    if ($result = $mysqli->query($query)) {
        
        $valeurs = [];
        
        while ($row = $result->fetch_assoc()) {
            $valeurs[$row["pk_valeur_champ"]] = $row["label_valeur_champ"];
        }
        
        $json = json_encode($valeurs);
        status(200);
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
        write_log([
            "libelle" => "GET valeurs de champ",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => "",
            "erreur" => $mysqli->error,
            "document" => "",
            "objet" => $_POST["champ"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "GET valeurs de champ",
        "admin" => 0,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["champ"]
    ]);
}
?>
