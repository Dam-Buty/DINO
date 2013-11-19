<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    if ($_POST["cyclique"] == 1) {
        $query = "SELECT ``";
    } else {
    
    }
    
    
    $query = "SELECT `filename_document`, `display_document`, `fk_monde`, `fk_operation` FROM `document` WHERE `fk_client` = " . $_SESSION["client"] . " AND `niveau_document` IS NULL;";
    
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = '{ "status": "OK", "queue": "%%QUEUE%%" }';
        
        $json_queue = "[ ";
        
        while ($row = $result->fetch_assoc()) {
            if ($json_queue != "[ ") {
                $json_queue .= ', ';
            }
            
            $json_queue .= '{ "document": "", "status": 1, "size": "", "li": "", "filename": "' . $row["filename_document"] . '", "displayname": "' . $row["display_document"] . '", "store": { "monde": "", "operation": "", "champs": { "monde": "", "master": [], "normal": [] } , "categorie": "", "type_doc": { "pk": "", "detail": "" } } }';
        }
        
        $json_queue .= " ]";
        
        $json = str_replace('"%%QUEUE%%"', $json_queue, $json);
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
