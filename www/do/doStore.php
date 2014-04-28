<?php
session_start();
include("../includes/status.php");
include("../includes/log.php");

function format_date($date) {
    $d = substr($date, 0, 2);
    $m = substr($date, 3, 2);
    $y = substr($date, 6, 4);
    
    return $y . "-" . $m . "-" . $d;
}

$champs = array_filter($_POST["champs"]);

if ($_SESSION["niveau"] >= 10) {
    include("../includes/DINOSQL.php");
        
    try {
        $dino = new DINOSQL();
        
        $params_document = [
            "date" => format_date($_POST["date"]),
            "filename" => $_POST["filename"]
        ];
        
        $dino->query("store_document", $params_document);
            
        $params_type = [
            "type" => $_POST["type"],
            "categorie" => $_POST["categorie"],
            "champ" => $_POST["maxchamp"],
            "monde" => $_POST["monde"],
            "client" => $_SESSION["client"],
            "filename" => $_POST["filename"],
            "detail" => $_POST["detail"],
            "dClient" => $_SESSION["client"],
            "tddClient" => $_SESSION["client"],
            "tddMonde" => $_POST["monde"],
            "tddCategorie" => $_POST["categorie"],
            "tddType" => $_POST["type"],
            "tddDetail" => $_POST["detail"],
            "dvcClient" => $_SESSION["client"],
            "dvcMonde" => $_POST["monde"],
            "dvcChamp" => $_POST["maxchamp"],
            "dvcValeur" => $champs[$_POST["maxchamp"]]
        ];

        if ($_POST["time"] != "000000") {
            $query_type .= "store_type_time";
            $params_type["time"] = $_POST["time"];
        } else {
            $query_type .= "store_type";
        }
        
        $dino->query($query_type, $params_type);
            
        foreach($champs as $pk => $valeur) {
            $params_champ = [
                "filename" => $_POST["filename"],
                "monde" => $_POST["monde"],
                "client" => $_SESSION["client"],
                "valeur" => $valeur,
                "pk" => $pk
            ];
            
            $dino->query("store_valeur", $params_champ);
            
        } // FIN FOREACH CHAMP
        
        $dino->commit();
        status(200);
    } catch (Exception $e) {
        $dino->rollback();
        status(500);
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Store document : droits insuffisants"
    ]);
    status(403);
}
?>
