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
    include("../includes/PDO.php");
        
    $params_document = [
        "date" => format_date($_POST["date"]),
        "filename" => $_POST["filename"]
    ];
    
    $result_document = dino_query("store_document", $params_document);
        
    if ($result_document["status"]) {
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
            "dvcValeur" = $champs[$_POST["maxchamp"]]
        ];
    
        if ($_POST["time"] != "000000") {
            $query_type .= "store_type_time";
            $params_type["time"] = $_POST["time"];
        } else {
            $query_type .= "store_type";
        }
        
        $result_type = dino_query($query_type, $params_type);
        
        if ($result_type["status"]) {
            
            $err = false;
            
            foreach($champs as $pk => $valeur) {
                $params_champ = [
                    "filename" => $_POST["filename"],
                    "monde" => $_POST["monde"],
                    "client" => $_SESSION["client"],
                    "valeur" => $valeur,
                    "pk" => $pk
                ];
                
                $result_champ = dino_query("store_valeur", $params_champ);
                
                if (!$result_champ["status"]) {
                    status(500);
                    $err = true;
                    break;
                }
            } // FIN FOREACH CHAMP
            
            if (!$err) {
                status(200);
            }
        } else {
            status(500);
        }   
    } else {
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
