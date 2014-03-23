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
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />

</head>

<body>

<div id="container-signup">
    <div id="container-tips">
        <h1>Bienvenido en la comunidad DINO!</h1>
        <p>En un momento estaras utilizando tu primer <b>archivero digital</b>!</p>
        <p>Te invitamos primero a <b>ingresar tus datos</b>.</p>
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
            <input type="submit" class="submit-signup" id="submit-page-1" value="Empieza con DINO !"/>
        </div>
        <!-- <div id="page-2">
            <div class="champ-signup">
                <input type="text" name="entreprise" id="entreprise" placeholder="Nombre de tu empresa"/>
            </div>
            <div class="champ-signup">
                <input type="text" name="secteur" id="secteur" placeholder="El sector de tu empresa"/>
            </div>
            <input type="submit" class="submit-signup" id="submit-page-2" value="Elegir un plan"/>
        </div> -->
    </div>
    <!-- <div id="container-plan">
        <h1>Elige tu plan de tarifa</h1>
        <div class="plan" id="plan-1">
            <h3>Starter</h3>
            <h2>FREE</h2>
            <ul>
                <li>1 usuario</li>
                <li>2Gb de espacio</li>
                <li class="more" id="more-chat-support">Soporte en linea 9/18</li>
                <li class="more" id="more-mondes">2 Mundos documentales</li>
            </ul>
        </div>
        <div class="plan" id="plan-2">
            <h3>PRO</h3>
            <h2>49$ USD/mes</h2>
            <ul>
                <li class="more" id="more-users">1-5 usuarios incluidos</li>
                <li class="more" id="more-space">10 Gb de espacio incluido</li>
                <li class="more" id="more-tel-support">Soporte telefónico 9/18</li>
                <li class="more" id="more-visitors">Usuarios "Visitor" ilimitados</li>
                <li class="more" id="more-mondes">Mundos documentales ilimitados</li>
                <li>(4.99$/mes el usuario adicional)</li>
                <li>(A partir de 0.49$/mes el Gb adicional)</li>
            </ul>
        </div>
        <div class="plan" id="plan-3">
            <h3>ENTERPRISE</h3>
            <h2>a partir de $249 USD/mes</h2>
            <ul>
                <li class="more" id="more-users">5-20 usuarios incluidos</li>
                <li class="more" id="more-space">50 Gb de espacio incluido</li>
                <li class="more" id="more-config">Mundos documentales personalizados</li>
                <li class="more" id="more-import">Opciones de importacion avanzadas</li>
                <li>(9.99$/mes el usuario adicional)</li>
                <li>(A partir de 0.19$/mes el Gb adicional)</li>
            </ul>
        </div>
    </div> -->
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
