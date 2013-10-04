<?php

function mail_first_ope($nom) {
    $message = '
<strong>Estimado Agente Aduanal ' . $nom . '</strong><br/>
<br/>
Gracias por archivar su primera operación aduanal en la nube con <b>CS Storage</b>!<br/>
<br/>
Este correo es un resumen de las informaciones importantes por el uso de <b>CS Storage</b>.
<br/>
<br/>
<big><b>Primero, le recomendamos consultar <a href="http://correosolucion.com/wp-content/uploads/2013/05/Guia-de-usuario-CS-Storage-Aduanas-v5.pdf">nuestra guía de usuario disponible en nuestra página web</a> para un mejor conocimiento del funcionamiento de nuestra solución.
<br/>
<br/>
<ul>
<li>Para consultar sus operaciones archivadas, usted debe ir en <a href="http://storage.correosolucion.com">esta página</a> (http://storage.correosolucion.com).</li>
<li>Si usted necesita descargar otra vez la solución <b>CS Storage</b>, la encontrara <a href="http://release.correosolucion.com/public/CSStorage.exe">aqui</a> (http://release.correosolucion.com/public/CSStorage.exe).</li>
<li>Usted puede consultar sus datos de conexión al servicio en el primer correo que le hemos enviado. Para una seguridad máximum, <b>nosotros no conocemos su contraseña</b>. Por eso, si usted la pierde, no hay modo de recuperarla y sus documentos estarán <b>perdidos</b>!</li>
</ul>
<br/>
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