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
<link href="http://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" href="css/global.css?v=3" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/validationEngine.jquery.css?v=1" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css?v=1" media="screen" type="text/css"/>

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
<div id="jauge"></div>

<div id="content"></div>

<script src="js/sha512.js?v=1"></script>
<script src="js/enc-base64.js?v=1"></script>
<script src="js/jquery-1.10.2.js?v=1"></script>
<script src="js/jquery-ui-1.10.3.custom.js?v=1"></script>
<script src="js/jquery.validationEngine.js?v=1"></script>
<script src="js/jquery.validationEngine-es.js?v=1"></script>
<script src="js/CS.Crypto.js?v=1"></script>
<script src="js/bootstrap.js?v=1"></script>
<script src="js/application.js?v=1"></script>
<script src="js/queue.js?v=1"></script>

<script type="text/javascript">
    var profil = undefined;
</script>
</body>
</html>
