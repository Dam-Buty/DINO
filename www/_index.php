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

<link rel="stylesheet" href="css/global.css?v=3" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/arrows.css?v=3" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/tuto.css?v=3" media="screen" type="text/css"/>

<link href='http://fonts.googleapis.com/css?family=Hammersmith+One' rel='stylesheet' type='text/css'>

<link rel="shortcut icon" type="image/ico" href="favicon.ico" />

<?php
    if ($_SESSION["niveau"] >= 20) {
    ?>
<link rel="stylesheet" href="css/admin.css?v=3" media="screen" type="text/css"/>
    <?php
    }
?>

<link rel="stylesheet" href="css/boutons.css?v=3" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/inputs.css?v=3" media="screen" type="text/css"/>

<link rel="stylesheet" href="vendor/chosen.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/zebra_dialog_custom.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/switchy.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/jquery-ui-1.10.3.custom.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="vendor/tooltipster.css" media="screen" type="text/css"/>

</head>
<body>

<div id="front">
    <div id="laterale-front" class="barre-laterale">
        <a href="index.php"><h1>DINO</h1></a>
        <ul class="menu-lateral" id="menu-front">
    <?php
    if ($_SESSION["niveau"] >= 10) {
        ?>
            <li id="menu-queue">
                <h1>SUBIR DOCUMENTOS</h1>
            </li>
        <?php
    }
    ?>
    <?php
    if ($_SESSION["niveau"] >= 20) {
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
        <div id="toggle-date"></div>
        <ul class="list-mondes" id="mondes-top"></ul>
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
<?php
if ($_SESSION["niveau"] >= 30) {
?>
            <li id="menu-profil">
                <h1>Perfil<br/>documental</h1>
            </li>
<?php
}
?>
        </ul>
    </div>
    
    <div id="top-back" class="barre-top">
        <ul class="list-mondes" id="mondes-top-back"></ul>
    </div>
    
    <div id="backoffice"></div>
</div>

<?php
}
?>

<div class="barre-bottom">
    <div id="container-notification"></div>
    <img id="logout" src="img/logout_20.png">
    <img id="bouton-pass" src="img/pass_20.png">
    <img id="bouton-mail" src="img/mail_20.png">
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
        DINO nunca haria nada para lastimar un buzon inocente!
    </div>
</div>

<div id="opak"></div>

<div id="container-viewer-global">
    <div id="poignee-viewer-global">
        <img id="bouton-close-viewer" src="img/del_20.png"/>
    </div>
    <iframe id="viewer-global"></iframe>
</div>

<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>


<script src="http://cdnjs.cloudflare.com/ajax/libs/chosen/1.0/chosen.jquery.min.js"></script>

<script src="vendor/chosen.jquery.min.js"></script>
<script src="vendor/zebra_dialog.js"></script>
<script src="vendor/switchy.js"></script>
<script src="vendor/jquery.tooltipster.js"></script>

<script src="js/bootstrap.js"></script>
<script src="js/util.js"></script>
<script src="js/core.js"></script>
<script src="js/queue.js"></script>
<script src="js/dragdrop.js"></script>
<script src="js/store.js"></script>
<script src="js/dialogues.js"></script>
<script src="js/params.js"></script>
<script src="js/tuto.js"></script>

<?php
    if ($_SESSION["niveau"] >= 20) {
    ?>
<script src="js/admin.js"></script>
<script src="js/admin/users.js"></script>
<script src="js/admin/mondes.js"></script>
<script src="js/admin/profil.js"></script>
    <?php
    }
?>

<script type="text/javascript">
    var profil = undefined;
</script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-46251879-3', 'dino.mx');
  ga('send', 'pageview');

</script>

</body>
</html>

<?php } ?>
