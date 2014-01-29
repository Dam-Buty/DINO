<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $query = "SELECT 
                `label_valeur_champ`
                FROM `valeur_champ` 
                WHERE `fk_champ` = :champ
                    AND  `fk_client` = :client
                    AND `fk_monde` = :monde ;";   
                     
    $result = dino_query($query,[
        "client" => $_POST["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"]
    ]);
    
    if ($result["status"]) {
        $text = "";
        
        foreach($result["result"] as $row) {
            $text .= $row["label_valeur_champ"] . "\n";
        }
        
        status(200);
        header('Content-Type: text/plain');
        echo $text;
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $result["errinfo"][2] . '" }';
        header('Content-Type: application/json');
        echo $json;
    }
}
?>
