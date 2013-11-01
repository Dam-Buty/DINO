<?php
session_start();
include("../includes/status.php");

if ($_SESSION["niveau"] > 10) {
    include("../includes/mysqli.php");
    include("../includes/crypt.php");
    
    var_dump($_POST);
    
    
} else {
    status(403);
    $json = '{ "error": "nosession" }';
}

header('Content-Type: application/json');
echo $json;
?>
