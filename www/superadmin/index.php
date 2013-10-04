<?php
session_start();
if (isset($_SESSION["superadmin"])) {
    include("static/header.php");
    include("admin_clients.php");
    include("static/footer.php");
}
else {
    header("Location: login.php");
}
?>
