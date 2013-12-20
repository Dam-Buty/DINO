<?php
session_start();
 ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
        "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
<head>
<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
<title>CS Storage</title>
<meta content="2013-02-28" name="date" />
<meta content="Damien BUTY" name="author" />
<meta content="Pagina de accesso a sus archivos digitales" name="description" />
<link href='css/Oswald-Bold.ttf' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="css/global.css?v=3" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/arrows.css?v=3" media="screen" type="text/css"/>

<?php
    if ($_SESSION["niveau"] > 20) {
    ?>
<link rel="stylesheet" href="css/admin.css?v=3" media="screen" type="text/css"/>
    <?php
    }
?>

<link rel="stylesheet" href="css/boutons.css?v=3" media="screen" type="text/css"/>

<link rel="stylesheet" href="vendor/validationEngine.jquery.css?v=1" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/chosen.css?v=1" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/zebra_dialog.css?v=1" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/switchy.css?v=1" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/jquery-ui.css" media="screen" type="text/css"/>

</head>
<body>

<div class="div_login">
    <form id='form_login'>
        <h1>Nombre de usuario</h1>
            <input type='text' id='login' name='login' class="validate[required]"/>
        <h1>Contrasena</h1>
            <input type='password' id='pass' class="validate[required]"/><br/>
        <input type="button" id="bouton_login" value="Ingresar"/>
    </form>
</div>

<div id="front">
    <div id="laterale-front" class="barre-laterale">
        <a href="index.php"><h1>DINO</h1></a>
        <ul class="menu-lateral" id="menu-front">
            <li id="menu-queue">
                <h1>SUBIR DOCUMENTOS</h1>
            </li>
    <?php
    if ($_SESSION["niveau"] > 20) {
        ?>
            <li id="menu-admin">
                <h1>ADMIN</h1>
            </li>
        <?php
    }
    ?>
        </ul>
    </div>

    <div id="top-front" class="barre-top">
        <select class="busquedor" type="text" id="search" multiple="multiple" data-placeholder="Buscar en este mundo..." data-state="closed"></select>
        <div id="switch-sort">
            <select> <!-- list-sort -->
                <option value="ASC">A-Z</option>
                <option value="DESC">Z-A</option>
            </select>
        </div>
        <div id="toggle-date"></div>
        <ul class="list-mondes" id="mondes-top"></ul>
        <div id="container-dates">
            <div id="slider-date"></div>
            <div id="text-date"></div>
        </div>
    </div>
    
</div>

<?php
if ($_SESSION["niveau"] > 20) {
?>
        
<div id="back">
    <div id="laterale-back" class="barre-laterale">
        <a href="index.php"><h1>DINO</h1></a>
        <ul class="menu-lateral" id="menu-back">
            <li id="menu-retour">
                <h1>Mis documentos</h1>
            </li>
            <li id="menu-users">
                <h1>Usuarios</h1>
            </li>
            <li id="menu-listes">
                <h1>Listas</h1>
            </li>
            <li id="menu-profil">
                <h1>Perfil<br/>documental</h1>
            </li>
        </ul>
    </div>
    
    <div id="top-back" class="barre-top"></div>
    
    <div id="backoffice"></div>
</div>

<?php
}
?>

<div class="barre-bottom"></div>

<div id="opak"></div>

<iframe id="viewer-global"></iframe>

<script src="vendor/jquery-1.10.2.js"></script>
<script src="vendor/jquery-ui.js"></script>

<script src="vendor/jquery.validationEngine.js?v=1"></script>
<script src="vendor/jquery.validationEngine-es.js?v=1"></script>

<script src="vendor/zebra_dialog.js?v=1"></script>
<script src="vendor/chosen.jquery.js?v=1"></script>
<script src="vendor/switchy.js?v=1"></script>

<script src="js/bootstrap.js?v=1"></script>
<script src="js/util.js?v=1"></script>
<script src="js/core.js?v=1"></script>
<script src="js/queue.js?v=1"></script>
<script src="js/dragdrop.js?v=1"></script>
<script src="js/store.js?v=1"></script>
<script src="js/dialogues.js?v=1"></script>

<?php
    if ($_SESSION["niveau"] > 20) {
    ?>
<script src="js/admin.js?v=1"></script>
<script src="js/admin/users.js?v=1"></script>
<script src="js/admin/mondes.js?v=1"></script>
<script src="js/admin/profil.js?v=1"></script>
    <?php
    }
?>

<script type="text/javascript">
    var profil = undefined;
</script>
</body>
</html>
