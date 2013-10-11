<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    include("../includes/status.php");
    
    $query = "SELECT `filename_document`, `nom_temp_document` FROM `document` WHERE `fk_client` = " . $_SESSION["client"] . " AND `type_document` = 0;";
    
    if ($result = $mysqli->query($query)) {
        status(200);
        $json = '{ "status": "OK", "queue": %%QUEUE%% }';
        
        $json_queue = "[ ";
        
        while ($row = $result->fetch_assoc()) {
            if ($json_queue != "[ ") {
                $json_queue .= ', ';
            }
            
            $json_queue .= '{ "document": "", "status": 1, "size": "", "li": "", "filename": "' . $row["nom_temp_document"] . '", "displayname": "' . $row["filename_document"] . '" }';
        }
        
        $json_queue .= " ]";
        
        $json = str_replace('%%QUEUE%%', $json_queue, $json);
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
