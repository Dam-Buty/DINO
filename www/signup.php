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
<link rel="stylesheet" href="css/signup.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/inputs.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/util.css" media="screen" type="text/css"/>
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />

</head>

<body>

<div id="container-loading" class="dialog-box">
    <img src="img/big_loader.gif"/>
</div>

<div id="container-signup" class="dialog-box">
    <div id="container-tips">
        <h1>Bienvenido a DINO</h1>
        <p>Ingresa tus datos para ser parte de nuestra comunidad.</p>
    </div>
    <div id="container-champs">
        <div id="page-1">
            <div class="champ-signup">
                <input type="text" name="mail" id="mail" placeholder="Correo electronico"/>
            </div>
            <div class="champ-signup">
                <input type="text" name="login" id="login" placeholder="Nombre de usuario"/>
            </div>
            <div class="champ-signup">
                <input type="password" name="pass" id="pass" placeholder="Contrasena"/>
            </div>
            <div class="champ-signup">
                <input type="password" name="pass2" id="pass2" placeholder="Confirmar contrasena"/>
            </div>
            <input type="submit" class="submit-signup" id="submit-page-1" value="Start DINO"/>
        </div>
    </div>
    <div style="clear: both;"></div>
</div>


<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>

<script src="js/dialogues.js"></script>
<script src="js/util.js"></script>
<script src="js/signup.js"></script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-46251879-3', 'dino.mx');
  ga('send', 'pageview');

</script>

<script type="text/javascript">
bootstrap_signup();
</script>
</body>
</html>
