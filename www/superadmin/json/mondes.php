<?php
session_start();

if ($_SESSION["superadmin"]) {
    include("../../includes/mysqli.php");
    include("../../includes/status.php");
    
    $query = "SELECT `pk_monde`, `label_monde`, `cyclique_monde`, `niveau_monde` FROM `monde` WHERE `fk_client` = " . $_POST["client"] . ";";
    
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = "[ ";
        while ($row = $result->fetch_assoc()) {
            if ($json != "[ ") {
                $json .= ", ";
            }
            
            $json .= '{ "pk": "' . $row["pk_monde"] . '", "label": "' . $row["label_monde"] . '", "cyclique": "' . $row["cyclique_monde"] . '", "niveau": "' . $row["niveau_monde"] . '" }';
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
