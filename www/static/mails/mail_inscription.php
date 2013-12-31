<?php

function mail_inscription($nom, $credit, $login, $pass) {
    $message = '
<strong>Estimado Agente Aduanal ' . $nom . '</strong><br/>
<br/>
Le damos la bienvenida en nuestra solución de gestión y almacenamiento de archivos aduanales <b>CS Storage</b>.<br/>
<br/>
Nuestro equipo esta validando su inscripcion; esta etapa no necesita ninguna intervención por su parte. 
<br/>
<big><b>En un tiempo máximo de 24h, le mandaremos nuevamente un email con instrucciones para activar su cuenta, descargar nuestro software y empezar a archivar en la nube.</b></big><br/>
<br/>
Una vez su cuenta validada, usted se podrá conectar con los datos siguientes:
<br/><br/>
Login: <b>' . $login . '</b><br/>
Password: <b>' . $pass . '</b><br/>
<br/>
<br/>
<big>Le recomendamos que guarde una copia de su <b>nombre de usuario</b> y de su <b>contraseña</b>. Por la seguridad de sus datos, nosotros <b>no tenemos estas informaciones</b>. Por eso, si usted los pierde, no se podran recuperar sus documentos!
<br/>
<br/>
<em>Usted podrá probar nuestra solución con <strong>' . $credit . ' créditos gratuitos</strong>.</em><br/>
<br/>
<b><big>También usted puede consultar <a href="http://correosolucion.com/wp-content/uploads/2013/05/Guia-de-usuario-CS-Storage-Aduanas-v5.pdf">nuestra guía de usuario disponible en nuestra página web</a></big></b><br/>
<br/>
Gracias por su preferencia<br/>
<br/>
<p style="text-align: center;"><span style="color: #219add;"><strong><em>CS Storage by Correo Solución</em></strong></span></p>
<pre>Correo Solución Sa de Cv</pre>
<pre>Amsterdam 240, int 4,</pre>
<pre>Col Hipodromo Condesa</pre>
<pre>06100 Mexico DF</pre>
<pre>Tel: 55.63.63.32.81</pre>';

    return $message;
}
?>
