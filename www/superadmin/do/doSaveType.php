<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/PDO.php");
    include("../../includes/status.php");
    
    $params = [
        "label" => $_POST["label"],
        "detail" => $_POST["detail"],
        "niveau" => $_POST["niveau"],
        "client" => $_POST["client"],
        "monde" => $_POST["monde"],
        "champ" => $_POST["champ"],
        "categorie" => $_POST["categorie"]
    ];
    
    if ($_POST["pk"] == "new") {
        $query = "
            INSERT INTO `type_doc` (
                `label_type_doc`, 
                `detail_type_doc`, 
                `niveau_type_doc`, 
                `fk_client`, 
                `fk_monde`, 
                `fk_champ`, 
                `fk_categorie_doc`
            ) VALUES (
                :label, 
                :detail, 
                :niveau, 
                :client, 
                :monde, 
                :champ, 
                :categorie
            )
        ;";
    } else {
        $query = "
            UPDATE `type_doc` SET 
                `label_type_doc` = :label, 
                `detail_type_doc` = :detail, 
                `niveau_type_doc` = :niveau
            WHERE 
                `pk_type_doc` = :pk
                AND `fk_client` = :client
                AND `fk_monde` = :monde
                AND `fk_champ` = :champ
                AND `fk_categorie_doc` = :categorie
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
