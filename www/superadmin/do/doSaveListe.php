<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $query = "
        DELETE FROM `valeur_champ` 
        WHERE 
            `fk_champ` = :champ
            AND `fk_monde` = :monde
            AND `fk_client` = :client
    ;";
    
    $result = dino_query($query,[
        "client" => $_POST["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"]
    ]);
    
    
    if ($result["status"]) {
        foreach(explode(PHP_EOL, $_POST["liste"]) as $ligne) {
            if ($ligne != "") {
                $query = "
                    INSERT INTO `valeur_champ` (
                        `label_valeur_champ`, 
                        `fk_champ`, 
                        `fk_monde`, 
                        `fk_client`
                    ) VALUES (
                        :label, 
                        :champ, 
                        :monde, 
                        :client
                    )
                ;";
                
                $result = dino_query($query,[
                    "client" => $_POST["client"],
                    "monde" => $_POST["monde"],
                    "champ" => $_POST["champ"],
                    "label" => $ligne
                ]);
            }
        }
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    
    header('Content-Type: application/json');
    echo $json;
}
?>
