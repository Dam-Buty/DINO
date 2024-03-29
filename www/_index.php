<?php
session_start();

if (isset($_SESSION)) {

 ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
        "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
<head>
<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=ISO-8859-1" />
<title>DINO</title>
<meta content="2013-02-28" name="date" />
<meta content="Damien BUTY" name="author" />
<meta content="La revolucion documental!" name="description" />

<link rel="stylesheet" href="css/global.css?v=7" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/arrows.css?v=7" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/tuto.css?v=7" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/util.css?v=7" media="screen" type="text/css"/>
<link href='http://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic' rel='stylesheet' type='text/css'>

<link href='http://fonts.googleapis.com/css?family=Hammersmith+One' rel='stylesheet' type='text/css'>

<link rel="shortcut icon" type="image/ico" href="favicon.ico" />

<?php
    if ($_SESSION["niveau"] >= 20) {
    ?>
<link rel="stylesheet" href="css/admin.css?v=7" media="screen" type="text/css"/>
    <?php
    }
?>

<link rel="stylesheet" href="css/boutons.css?v=7" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/inputs.css?v=7" media="screen" type="text/css"/>

<link rel="stylesheet" href="vendor/chosen.css?v=7" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/zebra_dialog_custom.css?v=7" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/switchy.css?v=7" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/jquery-ui-1.10.3.custom.css?v=7" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/tooltipster.css?v=7" media="screen" type="text/css"/>

</head>
<body>

<div id="front">
    <div id="laterale-front" class="barre-laterale">
        <a href="index.php"><h1></h1></a>
        <ul class="menu-lateral" id="menu-front">
    <?php
    if ($_SESSION["niveau"] >= 10) {
        ?>
            <li id="menu-queue" class="element-menu-front" title="Cargar documentos">
            </li>
        <?php
    }
    ?>
    <?php
    if ($_SESSION["niveau"] >= 20) {
        ?>
            <li id="menu-admin" class="element-menu-front" title="Administrar usuarios">
            </li>
        <?php
    }
    ?>
    <?php
    if ($_SESSION["niveau"] >= 30) {
        ?>
            <li id="menu-designer" class="element-menu-front" title="Crear un mundo">
            </li>
        <?php
    }
    ?>
        </ul>
    </div>

    <div id="top-front" class="barre-top">
        <select class="busquedor" type="text" id="search" multiple="multiple" data-placeholder="Buscar en este mundo..." data-state="closed"></select>
        <div id="toggle-date"></div>
        <ul class="list-mondes" id="mondes-top"></ul>
<?php
if ($_SESSION["niveau"] >= 30) {
?>
            <img src="img/edit_monde_100.png" id="bouton-admin-profil" title="Configurar su mundo"/>
<?php
}
?>
        <div id="container-dates">
            <div id="slider-date"></div>
            <div id="text-date"></div>
        </div>
    </div>

</div>

<?php
if ($_SESSION["niveau"] >= 20) {
?>
        
<div id="back">
    <div id="laterale-back" class="barre-laterale">
        <a href="index.php"><h1></h1></a>
        <ul class="menu-lateral" id="menu-back">
            <li id="menu-retour">
            </li>
        </ul>
    </div>
    
    <div id="backoffice" class="principal"></div>
</div>

<?php
}
?>

<div id="container-list-tutos">
    <span id="toggle-university"></span>
    <ul id="list-tutos">
        <li class="entete-list-tutos">TUTORIALES DINO</li>
    </ul>
    <ul id="list-documentation">
        <li class="entete-list-tutos">DINO UNIVERSITY</li>
        <li class="ligne-tuto"><a href="http://www.dino.mx/universidad/" target="_blank" title="Puedes encontrar toda la documentacion en el Blog DINO!">Blog DINO</a></li>
    </ul>
</div>

<div class="barre-bottom">
    <div id="container-notification">DINO esta en fase Beta, si encuentras algun bug o tienes cualquier pregunta, nos puedes contactar <a href="mailto:beta@dino.mx">aqui</a>.</div>
    <div class="container-powered">
        <i>Powered by</i> <a href="http://www.dino.mx" target="_blank">DINO</a>
    </div>
    <img id="logout" src="img/logout_20.png" title="Desconectar">
    <?php if ($_SESSION["niveau"] >= 30) {
    ?>
    <img id="bouton-suppr" src="img/apocalypse_20.png" title="Borrar un mundo">
    <?php
    }
    ?>
    <img id="bouton-pass" src="img/pass_20.png" title="Cambiar tu contrasena">
    <img id="bouton-mail" src="img/mail_20.png" title="Cambiar tu correo electronico">
    <img id="help-printer" src="img/printer_20.png">
    <?php if ($_SESSION["niveau"] >= 10) {
    ?>
    <img id="bouton-tuto" src="img/tuto_20.png"/>
    <?php
    }
    ?>
</div>

<div id="container-change-pass">
    <ul class="container-params" id="container-old-pass">
        <li>Gracias por entrar su contrasena <b>de origen</b> :</li>
        <li><input type="password" id="pass-old" placeholder="Contrasena de origen"/></li>
        <li><div id="confirm-password" class="boutons boutons-param">Confirmar</div></li>
    </ul>
    <div id="tip-old-pass-params" class="container-arrow KO arrow-params">
        Su contrasena no es valida!
    </div>
    <ul class="container-params" id="container-new-pass">
        <li><input type="password" id="pass-params" placeholder="Entre una nueva contrasena"/></li>
        <li><input type="password" id="pass2-params" placeholder="Repite su contrasena"/></li>
        <li><div id="change-password" class="boutons boutons-param">Guardar contrasena</div></li>
    </ul>
    <div id="tip-pass-params" class="container-arrow OK arrow-params">
        Su contrasena es la pieza clave de la seguridad de sus datos.<br/>
        Una contrasena robusta contiene a lo menos 8 caracteres, incluyendo :<br/>
        <ul>
            <li>una minuscula,</li>
            <li>una MAYUSCULA,</li> 
            <li>un numero</li>
            <li>y uno de esos caracteres especiales : !@#$%^&*?_~</li>
        </ul>
        Por ejemplo : <b>Bacon_2013</b> es una deliciosa contrasena.
    </div>
</div> 

<div id="container-change-mail">
    <ul class="container-params" id="container-old-pass-mail">
        <li>Gracias por entrar su contrasena :</li>
        <li><input type="password" id="pass-old-mail" placeholder="Contrasena"/></li>
        <li><div id="confirm-password-mail" class="boutons boutons-param">Confirmar</div></li>
    </ul>
    <div id="tip-old-pass-params-mail" class="container-arrow KO arrow-params">
        Su contrasena no es valida!
    </div>
    <ul class="container-params" id="container-new-mail">
        <li><input type="text" id="mail-params" placeholder="Entre un nuevo correo electronico"/></li>
        <li><div id="change-mail" class="boutons boutons-param">Guardar email</div></li>
    </ul>
    <div id="tip-mail-params" class="container-arrow OK arrow-params">
        DINO odia el SPAM! Tu correo electronico esta seguro con nosotros.
    </div>
</div>

<div id="opak"></div>

<div id="container-viewer-global">
    <div id="poignee-viewer-global">
        <div id="label-convert">Este documento fue convertido automaticamente en PDF. <a id="lien-original">Descargar el original</a>.</div>
        <img id="bouton-close-viewer" src="img/del_20.png"/>
    </div>
    <iframe id="viewer-global"></iframe>
</div>

<div id="container-tuto"></div>

<div id="popup-welcome-info" class="dialog-box popup-welcome">
    <h1>Datos personales</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-75"></div></div>
    <p>Tu cuenta DINO casi esta lista! Ahora solo necesitamos que nos cuentes un poco de tu.</p>
    <p><label>Nombre: <input type="text" id="nom" placeholder="Asi seras conocido adentro de DINO"/></label></p>
    <p><label>Empresa: <input type="text" id="entreprise" placeholder="El nombre de tu empresa"/></label></p>
    <p><input type="submit" id="info-submit" value="Empezar con DINO"/></p>
</div>

<div id="container-KO-info" class="dialog-box popup-welcome">
    <h1>Error de creacion de perfil</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-KO"></div></div>
    <p style="text-align: center; font-size: 1.1em;">Contactanos : <a href="mailto:beta@dino.mx">beta@dino.mx</a></p>
</div>  

<div id="container-loading" class="dialog-box">
    <img src="img/big_loader.gif"/>
</div>

<?php
if ($_SESSION["niveau"] >= 20) {
?>
<div id="popup-dinostore" class="dialog-box">
    <h1>DINO Store</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-100"></div></div>
    <p>Por el momento, el <b>DINO store</b> esta en obras!</p>
    <p class="boutons next" id="contact-dinostore">Pide contacto</p>
    <p class="boutons" id="contacted-dinostore">Gracias! Nuestro servicio comercial te contactara en los proximos 24 horas.</p>
    <p class="boutons" id="quit-dinostore">Cancelar</p>
</div>
<?php
}
?>

<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>

<script src="vendor/chosen.jquery.min.js"></script>
<script src="vendor/zebra_dialog.js"></script>
<script src="vendor/switchy.js"></script>
<script src="vendor/jquery.tooltipster.js"></script>

<script src="js/Mentorial.js?v=7"></script>
<script src="js/Switch.js?v=7"></script>
<script src="js/Tag.js?v=7"></script>
<script src="js/bootstrap.js?v=7"></script>
<script src="js/util.js?v=7"></script>
<script src="js/core.js?v=7"></script>
<script src="js/queue.js?v=7"></script>
<script src="js/dragdrop.js?v=7"></script>
<script src="js/store.js?v=7"></script>
<script src="js/dialogues.js?v=7"></script>
<script src="js/params.js?v=7"></script>
<script src="js/tuto.js?v=7"></script>

<?php
    if ($_SESSION["niveau"] >= 20) {
    ?>
<script src="js/admin.js?v=7"></script>
<script src="js/admin/users.js?v=7"></script>
    <?php
    }
?>

<?php
    if ($_SESSION["niveau"] >= 30) {
    ?>
<script src="js/admin/designer.js?v=7"></script>
<script src="js/admin/mondes_suppr.js?v=7"></script>
    <?php
    }
?>

<script type="text/javascript">
    var profil = undefined;
</script>

</body>
</html>

<?php } ?>
