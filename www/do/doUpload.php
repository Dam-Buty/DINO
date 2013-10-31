<?php
session_start();
include("../includes/status.php");

if ($_SESSION["niveau"] > 10) {
    include("../includes/mysqli.php");
    include("../includes/crypt.php");
    
    $filename = genere_clef(12, TRUE);
    
    $query = "INSERT INTO `document` (`filename_document`, `display_document`, `fk_client`, `fk_user`, `date_upload_document`) VALUES ('" . $filename . ".pdf', '" . $_FILES['document']['name'] . "', " . $_SESSION["client"] . ", '" . $_SESSION["user"] . "', '" . date("Y-m-d H:i:s") . "');";
    
    if ($mysqli->query($query)) {
        
        if (move_uploaded_file($_FILES['document']['tmp_name'], "../cache/" . $_SESSION["client"] . "/temp/" . $filename . ".pdf")) {
            status(201);
            $json = '{ "status": "OK", "filename": "' . $filename . '.pdf" }';
        } else {
            status(500);
            $json = '{ "error": "move_uploaded_file" }';
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
