<?php
session_start();
include("../includes/status.php");
include("../includes/PDO.php");
include("../includes/log.php");

if (isset($_SESSION["niveau"])) {
      
    $result = dino_query("end_tuto",[
        "user" => $_SESSION["user"],
        "tuto" => $_POST["tuto"]
    ]);  
    
    if ($result["status"]) {
        header("Location: ../index.php");
    } else {
        header("Location: ../index.php");
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "End tuto : pas de niveau session"
    ]);
    header("Location: ../index.php");
}
?>
