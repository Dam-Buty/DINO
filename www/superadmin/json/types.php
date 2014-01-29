<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $query = "
        SELECT 
            `pk_type_doc`, 
            `label_type_doc`, 
            `detail_type_doc`, 
            `niveau_type_doc` 
            FROM `type_doc` 
        WHERE 
            `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
            AND `fk_categorie_doc` = :categorie
    ;";
           
    $result = dino_query($query,[
        "client" => $_POST["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "categorie" => $_POST["categorie"]
    ]);
    
    if ($result["status"]) {
        status(200);
        $json = "[ ";
        foreach($result["result"] as $row) {
            if ($json != "[ ") {
                $json .= ", ";
            }
            
            $json .= '{ "pk": "' . $row["pk_type_doc"] . '", "label": "' . $row["label_type_doc"] . '", "detail": "' . $row["detail_type_doc"] . '", "niveau": "' . $row["niveau_type_doc"] . '" }';
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
