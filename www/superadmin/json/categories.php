<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $query = "
        SELECT 
            `pk_categorie_doc`, 
            `label_categorie_doc`, 
            `niveau_categorie_doc`,
            `time_categorie_doc`
        FROM `categorie_doc` 
        WHERE 
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
    ;";
           
    $result = dino_query($query,[
        "client" => $_POST["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"]
    ]);
    
    if ($result["status"]) {
        status(200);
        $json = "[ ";
        
        foreach($result["result"] as $row) {
            if ($json != "[ ") {
                $json .= ", ";
            }
            
            $json .= '{ "pk": "' . $row["pk_categorie_doc"] . '", "label": "' . $row["label_categorie_doc"] . '", "niveau": "' . $row["niveau_categorie_doc"] . '", "time": "' . $row["time_categorie_doc"] . '" }';
        }
        
        $json .= " ]";
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $result["errinfo"][2] . '" }';
    }
    header('Content-Type: application/json');
    echo $json;
}
?>
