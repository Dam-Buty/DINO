<?php
session_start();
include("../includes/log.php");
if ($_SESSION["niveau"] >= 20) {
    include("../includes/DINOSQL.php");
    include("../includes/status.php");
    
    try {
        $dino = new DINOSQL();
        
        $result = $dino->query("check_documents_valeur",[
            "dClient" => $_SESSION["client"],
            "dvcClient" => $_SESSION["client"],
            "monde" => $_POST["monde"],
            "champ" => $_POST["champ"],
            "pk" => $_POST["pk"]
        ]);
        
        status(200);
        echo count($result);
    } catch (Exception $e) {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Vérifie si des documents sont associés à une valeur de champ"
    ]);
    status(403);
}
?>
