<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    if ($_POST["cyclique"] == 1) {
        $query = "SELECT * FROM `operation` WHERE `fk_client` = " . $_SESSION["client"] . " AND `fk_monde` = " . $_POST["monde"] . ";";
        
        if ($result = $mysqli->query($query)) {
            status(200);
            
            $json = "[ ";
            
            while ($row = $result->fetch_assoc()) {
                if ($json != "[ ") {
                    $json .= ', ';
                }
                
                $json_queue .= '{ "document": "", "status": 1, "size": "", "li": "", "filename": "' . $row["filename_document"] . '", "displayname": "' . $row["display_document"] . '", "store": { "monde": "", "operation": "", "champs": { "monde": "", "master": [], "normal": [] } , "categorie": "", "type_doc": { "pk": "", "detail": "" } } }';
            }
            
            $json .= " ]";
    } else {
    
    }
    
    } else {
        status(500);
        $json = '{ "error": "mysqli", "query": "' . $query . '", "message": "' . $mysqli->error . '" }';
    }
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
