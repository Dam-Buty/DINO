<?php
session_start();
include("../includes/status.php");  
include("../includes/log.php");  

if (isset($_SESSION["niveau"])) {
    include("../includes/PDO.php"); 
    
    $query = "
        SELECT 
            DATE_FORMAT(
                MAX(`document`.`date_document`),
                '%Y-%m-%d'
            ) as `max`, 
            DATE_FORMAT(
                MIN(`document`.`date_document`),
                '%Y-%m-%d'
            ) as `min`
        FROM `document`, `type_doc_document` 
        WHERE 
            `type_doc_document`.`fk_document` = `document`.`filename_document`
            AND `document`.`fk_client` = :client
            AND `type_doc_document`.`fk_monde` = :monde;";
        
    $params = [
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"]
    ];
    
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        
        $dates = [];
        
        $row = $result["result"][0];
        
        $dates["mini"] = $row["min"];
        $dates["maxi"] = $row["max"];
        
        if ($dates["mini"] == null) {
            $dates["mini"] = date("Y-m-d");
        }
        
        if ($dates["maxi"] == null) {
            $dates["maxi"] = date("Y-m-d");
        }
        
        $json = json_encode($dates);
        status(200);
        header('Content-Type: application/json');
        echo $json;
    } else {
        status(500);
        write_log([
            "libelle" => "GET dates min/max",
            "admin" => 0,
            "query" => $query,
            "statut" => 1,
            "message" => $result["errinfo"][2],
            "erreur" => $result["errno"],
            "document" => "",
            "objet" => $_POST["monde"]
        ]);
    }
} else {
    status(403);
    write_log([
        "libelle" => "GET dates min/max",
        "admin" => 0,
        "query" => $query,
        "statut" => 666,
        "message" => "",
        "erreur" => "",
        "document" => "",
        "objet" => $_POST["monde"]
    ]);
}
?>
