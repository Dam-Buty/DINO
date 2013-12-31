<?php
session_start();
if (isset($_SESSION["superadmin"])) {
    include("static/header.php");
    include("static/menu.php");    
    if (isset($_GET["client"])) {
        include("admin_clients.php");   
    }
    if (isset($_GET["profil"])) {
        include("admin_profils.php");   
    }
    include("static/footer.php");
}
else {
    header("Location: login.php");
}
?>
