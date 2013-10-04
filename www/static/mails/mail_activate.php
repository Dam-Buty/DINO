<?php

function mail_activate($leClient, $lesCredits) {
    $leMessage = '
<strong>Estimado Agente Aduanal ' . $leClient . '</strong><br/>
<br/>
Felicitación! Su cuenta <strong>CS Storage</strong> esta lista para usarse. Usted puede probar nuestra solución con <strong>' . $lesCredits . ' créditos gratuitos</strong>.<br/>
<br/>
<b><big>Para descargar y empezar a usar CS Storage, usted tiene que identificarse <a href="http://subscribe.correosolucion.com/activate.php" target="_blank">en esta página</a> con su nombre de usuario y su contraseña, que le enviemos con el correo precediente.</big></b><br/>
<br/>
El proceso de descarga y de instalación le guiara hasta su primera operación aduanal archivada en la nube!<br/>
<i>Si el enlace no funciona, usted puede copiar la dirección siguiente en su navegador internet: </i><i>http://subscribe.correosolucion.com/activate.php</i><br/>
<br/>
<b><big>También usted puede consultar nuestra <a href="http://correosolucion.com/wp-content/uploads/2013/05/Guia-de-usuario-CS-Storage-Aduanas-v5.pdf">guía de usuario disponible en nuestra página web</a></big></b><br/>
<br/>
<p style="text-align: left;">Gracias por su preferencia</p>
<strong><span style="color: #1d8fe2;"><em>CS Storage by Correo Solución</em></span></strong>
<pre>Correo Solución Sa de Cv</pre>
<pre>Amsterdam 240, int 4,</pre>
<pre>Col Hipodromo Condesa</pre>
<pre>06100 Mexico DF</pre>
<pre>Tel: 55.63.63.32.81</pre>';
                
    return $leMessage;
}


?>
