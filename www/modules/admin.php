<?php
session_start();
// LOCALISATION !!!
if ($_SESSION["niveau"] > 20) {
?>
<div id="content-admin">Bienvenido en su administracion DINO...</div>

<div id="menu">
    <ul id="menu-list">
        <li data-action="users">
            <a href="#" id="admin-users">Getion de usuarios</a>
        </li>
        <li>
            <a href="#">Gestion de los mundos</a>
            <ul id="menu-champs"></ul>
        </li>
        <li data-action="share">
            <a href="#" id="admin-share">Reglas de compartido</a>
        </li>
    </ul>
</div>


<script type="text/javascript">
    bootstrap_admin();
</script>
<?php } ?>
