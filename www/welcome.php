<?php
include("modules/mockup.php");
?>

<div id="popup-welcome-activate" class="dialog-box popup-welcome">
    <h1>Activa tu cuenta DINO</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-25"></div></div>
    <p>Has recibido un <b>mensaje de activacion</b> a <b><?php echo $_GET["mail"]; ?></b>.</p>
    <p>Da <u>click</u> en el enlace incluido y puedes comenzar a explorar DINO.</p>
</div>

<div id="popup-welcome-security" class="dialog-box popup-welcome">
    <h1>La seguridad en DINO</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-50"></div></div>
    <div id="sermon">
        <p>La seguridad de tus documentos es muy importante para nosotros. Tus datos son tuyos, y solo tuyos.</p>
        <p>Esta seguridad solo se puede garantizar si tienes <a href="http://en.wikipedia.org/wiki/Password_strength" target="_blank">una contraseña segura</a>.</p>
        <p>Por eso te pedimos que tu contraseña contenga a lo menos los elementos siguientes :</p>
    </div>
    <ul>
        <li id="pass-length">min. 8 caracteres</li>
        <li id="pass-strength">una <span id="pass-maj">mayuscula</span>, una <span id="pass-min">minuscula</span> y un <span id="pass-num">numero</span></li>
        <li id="pass-char">un caracter especial</li> 
    </ul>
    <div class="lien-welcome" id="lien-pass">
        Crea tu contraseña
    </div>
    <div id="pass-form">
        <p><input type="password" id="pass" placeholder="Entra tu contraseña..."/></p>
        <p><input type="password" id="pass2" placeholder="Confirma tu contraseña..."/></p>
        <p><input type="submit" id="pass-submit" value="Guardar contraseña"/></p>
    </div>
</div>

<div id="popup-welcome-info" class="dialog-box popup-welcome">
    <h1>Datos personales</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-75"></div></div>
    <p>Tu cuenta DINO casi esta lista! Ahora solo necesitamos que nos cuentes un poco de tu.</p>
    <p><label>Nombre: <input type="text" id="nom" placeholder="Asi seras conocido adentro de DINO"/></label></p>
    <p><label>Empresa: <input type="text" id="entreprise" placeholder="El nombre de tu empresa"/></label></p>
    <p><input type="submit" id="info-submit" value="Empezar con DINO"/></p>
</div>

<div id="popup-welcome-token" class="dialog-box popup-welcome">
    <h1>Tu usuario ha expirado</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-75"></div></div>
</div>

<div id="container-loading" class="login-box">
    <img src="img/big_loader.gif"/>
</div>

<div id="container-KO" class="dialog-box popup-welcome">
    <h1>Error de activacion</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-KO"></div></div>
    <p style="text-align: center; font-size: 1.1em;">Contactanos : <a href="mailto:beta@dino.mx">beta@dino.mx</a></p>
</div>  

<div id="container-KO-pass" class="dialog-box popup-welcome">
    <h1>Error de creacion de contraseña</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-KO"></div></div>
    <p style="text-align: center; font-size: 1.1em;">Contactanos : <a href="mailto:beta@dino.mx">beta@dino.mx</a></p>
</div>   

<div id="container-KO-info" class="dialog-box popup-welcome">
    <h1>Error de creacion de perfil</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-KO"></div></div>
    <p style="text-align: center; font-size: 1.1em;">Contactanos : <a href="mailto:beta@dino.mx">beta@dino.mx</a></p>
</div>     

<!--
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-46251879-3', 'dino.mx');
  ga('send', 'pageview');
</script> 
-->

<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="vendor/html2canvas.js"></script>
<script src="vendor/StackBlur.js"></script>
<script src="js/welcome.js"></script>
<script src="js/util.js"></script>

</body>
</html>
