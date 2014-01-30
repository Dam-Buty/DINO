<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $params = [
        "label" => $_POST["label"],
        "niveau" => $_POST["niveau"],
        "client" => $_POST["client"]
    ];
    
    if ($_POST["pk"] == "new") {
        $query = "
            INSERT INTO `monde` (
                `label_monde`, 
                `niveau_monde`, 
                `fk_client`
            ) VALUES (
                :label, 
                :niveau, 
                :client
            );";
    } else {
        $query = "
            UPDATE `monde` SET 
                `label_monde` = :label, 
                `niveau_monde` = :niveau
            WHERE 
                `pk_monde` = :pk
                AND `fk_client` = :client ;";
        
        $params["pk"] = $_POST["pk"];
    }
    
    $result = dino_query($query, $params);
    
    if ($result["status"]) {
        status(200);
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $result["errinfo"][2] . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
