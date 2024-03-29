<?php
session_start();
include("../includes/functions.php");

if (isset($_SESSION["user"])) {
    $extension = strtolower(pathinfo($_POST["filename"], PATHINFO_EXTENSION));
    
    if ($extension == "pdf") {
        status(201);
    } else {
        if (file_exists("../cache/" . $_SESSION["client"] . "/" . $_POST["filename"] . "-pdf.dino")) {
            status(200);
        } else {
            status(404);
        }
    }
} else {
    dino_log([
        "niveau" => "Z",
        "query" => "Check PDF : pas de niveau session"
    ]);
    status(403);
}
?>
