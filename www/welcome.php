<?php
include("modules/mockup.php");
?>

<div id="popup-welcome-activate" class="dialog-box">
    <h1>Activa tu cuenta DINO</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-50"></div></div>
    <p>Has recibido un <b>mensaje de activacion</b> a <b><?php echo $_GET["mail"]; ?></b>.</p>
    <p>Da <u>click</u> en el enlace incluido y puedes comenzar a explorar DINO.</p>
</div>

<div id="popup-welcome-security" class="dialog-box">
    <h1>Activa tu cuenta DINO</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-50"></div></div>
    <p>Has recibido un <b>mensaje de activacion</b> a <b><?php echo $_GET["mail"]; ?></b>.</p>
    <p>Da <u>click</u> en el enlace incluido y puedes comenzar a explorar DINO.</p>
</div>

<div id="popup-welcome-token" class="dialog-box">
    <h1>Tu usuario ha expirado</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-50"></div></div>
    <p>Contacta tu administrador para reactivar tu cuenta.</p>
    <p><i>Si recibes este mensaje por error, no dudes en contactarnos en <a href="mailto:support@dino.mx">support@dino.mx</a>.</i></p>
</div>

<div id="container-loading" class="login-box">
    <img src="img/big_loader.gif"/>
</div>

<div id="container-KO" class="dialog-box">
    <h1>Error de activacion</h1>
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

</body>
</html>
