<?php
session_start();

if (isset($_SESSION["user"])) {
    include("_index.php");
} else {
    include("login.php");
}
?>
