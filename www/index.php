<?php
session_start();

if (isset($_SESSION["user"])) {
    if ($_SESSION["niveau"] == 999) {
        include("_superadmin.php");
    } else {
        include("_index.php");
    }
} else {
    include("login.php");
}
?>
