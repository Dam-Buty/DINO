<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

$champs = array_filter($_POST["champs"]);

if ($_SESSION["niveau"] >= 10) {
    include("../includes/DINOSQL.php");
    
    try {
        $dino = new DINOSQL();
        
        $params = [
            "client" => $_SESSION["client"],
            "monde" => $_POST["monde"],
            "categorie" => $_POST["categorie"],
            "type" => $_POST["type"],
            "detail" => $_POST["detail"],
            "dvcClient" => $_SESSION["client"],
            "dvcMonde" => $_POST["monde"],
            "dvcPk" => $_POST["maxchamp"],
            "dvcValeur" => $champs[$_POST["maxchamp"]]
        ];
        
        if ($_POST["time"] != "000000") {
            $query = "check_revision_time";
            $params["time"] = $_POST["time"];
        } else {
            $query = "check_revision";
        }   
        
        $result = $dino->query($query, $params);
                                 
        if (count($result) > 0) {
            status(200);
        } else {
            status(204);
        }   
    } catch (Exception $e) {
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Check revision : droits insuffisants"
    ]);
    status(403);
}
?>
