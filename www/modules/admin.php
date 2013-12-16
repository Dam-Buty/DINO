<?php
session_start();
// LOCALISATION !!!
if ($_SESSION["niveau"] > 20) {
?>
<div id="content-admin">Bienvenido en su administracion DINO...</div>

<div id="menu">
    <ul id="menu-list">
        <li data-action="users">
            <a href="#" id="admin-users">Usuarios</a>
        </li>
        <li>
            <a href="#">Listas</a>
            <ul id="sous-menu-monde"></ul>
        </li>
        <li>
            <a href="#" id="admin-profil">Perfil documental</a>
            <ul id="sous-menu-profil"></ul>
        </li>
    </ul>
</div>


<script type="text/javascript">
    bootstrap_admin();
</script>
<?php } ?>
