<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "
        DELETE FROM `categorie_doc` 
        WHERE 
            `pk_categorie_doc` = :pk
            AND `fk_client` = :client
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
        ;";
            
    $result = dino_query($query,[
        "client" => $_SESSION["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "pk" => $_POST["pk"]
    ]);
            
    if ($result["status"]) {
    
        $query = "
            DELETE FROM `type_doc` 
            WHERE 
                `fk_categorie` = :pk
                AND `fk_client` = :client
                AND `fk_monde` = :monde
                AND `fk_champ` = :champ
        ;"; 
        
        $result = dino_query($query,[
            "client" => $_SESSION["client"],
            "monde" => $_POST["monde"],
            "champ" => $_POST["champ"],
            "pk" => $_POST["pk"]
        ]);
        
        if ($result["status"]) { 
            status(200);
        } else {
            status(500);
            $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
        }
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
