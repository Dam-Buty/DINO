<?php

function mail_interlocuteur($login, $pass, $lentreprise) {
    $message = '
<strong>Hola Sr/Sra,</strong><br/>
<br/>
Gracias a que su agente aduanal <b>' . $lentreprise . '</b> es usuario de la solución de gestión de documentos <strong>CS Storage</strong>, usted también recibe los beneficios de consulta en línea de sus archivos aduanales de manera <strong>gratuita</strong>.<br/>
<br/>
<b><big>Usted se podra conectar a <a href="http://storage.correosolucion.com">esta pagina</a> con los datos siguientes:</big></b><br/>
<br/>
Login: <b>' . $login . '</b><br/>
Password: <b>' . $pass . '</b><br/>
<i>Si el enlace no funciona, usted puede copiar la direccion siguiente en su navegador : http://storage.correosolucion.com.</i>
<br/>
<br/>
En esta pagina, usted podrá buscar, consultar, descargar o imprimir todos los archivos relacionados con sus operaciones de comercio exterior en un solo click.<br/>
<br/>
<em>Para mayor información sobre Correo Solución Sa de Cv y su solución CS Storage, usted puede visitar nuestra página web: <span style="text-decoration: underline;"><span style="color: #3366ff; text-decoration: underline;">correosolucion.com</span></span></em>
<br/>
Gracias por su preferencia,
<p style="text-align: center;"><span style="color: #219ddd;"><strong><em>CS Storage by Correo Solución</em></strong></span></p>

<pre>Correo Solución Sa de Cv</pre>
<pre>Amsterdam 240, int 4,
Col Hipodromo Condesa
06100 Mexico DF
Tel: 55.63.63.32.81</pre>';
    return $message;
}
?>
