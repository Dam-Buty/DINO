<?php
session_start();
include("../includes/status.php");

if ($_SESSION["niveau"] >= 20) {
    status(200);
} else {
    status(403);
}
?>
