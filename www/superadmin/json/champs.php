<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $query = "
        SELECT 
            `pk_champ`, 
            `label_champ`, 
            `pluriel_champ`               
        FROM `champ` 
        WHERE 
            `fk_monde` = :monde
            AND `fk_client` = :client
        ORDER BY `pk_champ` ASC";
           
    $result = dino_query($query,[
        "client" => $_POST["client"],
        "monde" => $_POST["monde"]
    ]);
    
    if ($result["status"]) {
        status(200);
        $json = "[ ";
        
        foreach($result["result"] as $row) {
            if ($json != "[ ") {
                $json .= ", ";
            }
            
            $json .= '{ "pk": "' . $row["pk_champ"] . '", "label": "' . $row["label_champ"] . '", "pluriel": "' . $row["pluriel_champ"] . '" }';
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
