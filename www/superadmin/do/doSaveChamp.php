<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $params = [
        "label" => $_POST["label"],
        "pluriel" => $_POST["pluriel"],
        "monde" => $_POST["monde"],
        "client" => $_POST["client"]
    ];
    
    if ($_POST["pk"] == "new") {
        $query = "
            INSERT INTO `champ` (
                `fk_monde`, 
                `fk_client`, 
                `label_champ`, 
                `pluriel_champ`
            ) VALUES (
                :monde, 
                :client, 
                :label, 
                :pluriel
            );";
    } else {
        $query = "
            UPDATE `champ` 
            SET 
                `label_champ` = :label, 
                `pluriel_champ` = :pluriel 
            WHERE 
                `pk_champ` = :pk
                AND `fk_monde` = :monde
                AND `fk_client` = :client
        ;";
        
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
