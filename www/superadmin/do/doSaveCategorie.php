<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $params = [
        "label" => $_POST["label"],
        "niveau" => $_POST["niveau"],
        "time" => $_POST["time"],
        "monde" => $_POST["monde"],
        "client" => $_POST["client"],
        "champ" => $_POST["champ"]
    ];
    
    if ($_POST["pk"] == "new") {
        $query = "
            INSERT INTO `categorie_doc` (
                `label_categorie_doc`, 
                `niveau_categorie_doc`, 
                `time_categorie_doc`, 
                `fk_monde`, 
                `fk_client`, 
                `fk_champ`
            ) VALUES (
                :label, 
                :niveau, 
                :time, 
                :monde, 
                :client, 
                :champ
            );";
    } else {
        $query = "
            UPDATE `categorie_doc` 
            SET 
                `label_categorie_doc` = :label, 
                `niveau_categorie_doc` = :niveau , 
                `time_categorie_doc` = :time 
            WHERE 
                `fk_monde` = :monde
                AND `fk_client` = :client
                AND `fk_champ` = :champ
                AND `pk_categorie_doc` = :pk
        ;";
        
        $params["pk"] = $_POST["pk"];
    }
    
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        status(200);
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $result["errinfo"][2] . '" }';
        header('Content-Type: application/json');
        echo $json;
    }
}
?>
