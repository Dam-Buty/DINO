<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "SELECT `pk_type_doc`, `label_type_doc`, `detail_type_doc`, `niveau_type_doc` FROM `type_doc` WHERE `fk_client` = " . $_POST["client"] . " AND `fk_monde` = " . $_POST["monde"] . " AND `fk_champ` = " . $_POST["champ"] . " AND `fk_categorie_doc` = " . $_POST["categorie"] . ";";
    
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = "[ ";
        while ($row = $result->fetch_assoc()) {
            if ($json != "[ ") {
                $json .= ", ";
            }
            
            $json .= '{ "pk": "' . $row["pk_type_doc"] . '", "label": "' . $row["label_type_doc"] . '", "detail": "' . $row["detail_type_doc"] . '", "niveau": "' . $row["niveau_type_doc"] . '" }';
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
