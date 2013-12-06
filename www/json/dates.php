<?php
session_start();

if (isset($_SESSION["niveau"])) {
    include("../includes/mysqli.php");
    include("../includes/status.php");    
    
    $query = "
        SELECT 
            DATE_FORMAT(
                MAX(`document`.`date_document`),
                '%Y-%m-%d'
            ) as `max`, 
            DATE_FORMAT(
                MIN(`document`.`date_document`),
                '%Y-%m-%d'
            ) as `min`
        FROM `document`, `type_doc_document` 
        WHERE 
            `type_doc_document`.`fk_document` = `document`.`filename_document`
            AND `document`.`fk_client` = " . $_SESSION["client"] . " 
            AND `type_doc_document`.`fk_monde` = " . $_POST["monde"] . ";";
    
    if ($result = $mysqli->query($query)) {
        
        $dates = [];
        
        while ($row = $result->fetch_assoc()) {
            $dates["mini"] = $row["min"];
            $dates["maxi"] = $row["max"];
        }
        
        $json = json_encode($dates);
        status(200);
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
