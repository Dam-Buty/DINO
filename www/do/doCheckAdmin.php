<?php
session_start();
include("../includes/functions.php");

if ($_SESSION["niveau"] >= 20) {
    status(200);
    echo $_SESSION["niveau"];
} else {
    status(403);
}
?>
