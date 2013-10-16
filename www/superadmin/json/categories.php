<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "SELECT `pk_categorie_doc`, `label_categorie_doc`, `niveau_categorie_doc` FROM `categorie_doc` WHERE `fk_client` = " . $_POST["client"] . " AND `fk_monde` = " . $_POST["monde"] . ";";
    
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = "[ ";
        while ($row = $result->fetch_assoc()) {
            if ($json != "[ ") {
                $json .= ", ";
            }
            
            $json .= '{ "pk": "' . $row["pk_categorie_doc"] . '", "label": "' . $row["label_categorie_doc"] . '", "niveau": "' . $row["niveau_categorie_doc"] . '" }';
        }
        
        $json .= " ]";
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
    header('Content-Type: application/json');
    echo $json;
}
?>
