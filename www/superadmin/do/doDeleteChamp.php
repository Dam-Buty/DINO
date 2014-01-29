<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $query = "
        DELETE FROM `champ` 
        WHERE `pk_champ` = :pk
            AND  `fk_client` = :client 
            AND `fk_monde` = :monde; "
            
    $result = dino_query($query,[
        "client" => $_POST["client"],
        "monde" => $_POST["monde"],
        "pk" => $_POST["pk"]
    ]);
    
    if ($result["status"]) {
        $query = "
            DELETE FROM `valeur_champ` 
            WHERE `fk_champ` = :pk
                AND  `fk_client` = :client 
                AND `fk_monde` = :monde
        ;";     
        
        $result = dino_query($query,[
            "client" => $_POST["client"],
            "monde" => $_POST["monde"],
            "pk" => $_POST["pk"]
        ]);
        
        if ($result["status"]) { 
            status(200);
        } else {
            status(500);
            $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $result["errinfo"][2] . '" }';
        }
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $result["errinfo"][2] . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
