<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $query = "
        SELECT 
            `pk_monde`, 
            `label_monde`, 
            `niveau_monde` 
        FROM `monde` 
        WHERE `fk_client` = :client
    ;";
           
    $result = dino_query($query,[
        "client" => $_POST["client"]
    ]);
    
    if ($result["status"]) {
        status(200);
        $json = "[ ";
        
        foreach($result["result"] as $row) {
            if ($json != "[ ") {
                $json .= ", ";
            }
            
            $json .= '{ "pk": "' . $row["pk_monde"] . '", "label": "' . $row["label_monde"] . '", "niveau": "' . $row["niveau_monde"] . '" }';
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
