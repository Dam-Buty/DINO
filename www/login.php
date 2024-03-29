<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
        "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
<head>
<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
<title>DINO</title>
<meta content="2013-02-28" name="date" />
<meta content="Damien BUTY" name="author" />
<meta content="La revolucion documental" name="description" />
<link href='css/Oswald-Bold.ttf' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="css/login.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/inputs.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/util.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/zebra_dialog_custom.css?v=7" media="screen" type="text/css"/>
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />

</head>

<body>

<div id="container-login" class="login-box dialog-box">
<form name="form-login" id="form-login">
    <img src="img/dino_title_270.png"/>
    <?php
    if (isset($_GET["activated"])) {
    
    ?>
    <div id="container-activated">Tu cuenta esta activada.</div>
    <?php
    }
    ?>
    <div class="champ-login">
        <input type="text" name="login" id="login" placeholder="Nombre de usuario"/>
    </div>
    <div class="champ-login">
        <input type="password" name="pass" id="pass" placeholder="Contraseña"/>
    </div>
    <input type="submit" value="Ingresar"/>
    <div class="phrase-login">
        No tienes tu <b>DINO</b>?<br/>
        <a href="landing/classic-1">Tu cuenta es gratuita</a>
    </div>
</form>
</div>

<div id="container-loading" class="login-box">
    <img src="img/big_loader.gif"/>
</div>


<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>

<script src="vendor/zebra_dialog.js"></script>
<script src="js/login.js"></script>
<script src="js/dialogues.js"></script>
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
