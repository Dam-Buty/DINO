<?php

function mail_user($login, $pass) {
    $message = '
<strong>Hola Sr/Sra,</strong><br/>
<br/>
Gracias a que su empresa eligió la solución de gestión de documentos <strong>CS Storage</strong>, usted tiene ahora la posibilidad de centralizar, asegurar y consultar sus archivos aduanales en linea.<br/>
<br/>
Su agente aduanal ha creado para usted el siguiente usuario:<br/>
<br/>
Login: <b>' . $login . '</b><br/>
Password: <b>' . $pass . '</b><br/>
<br/>
<big><b>Para empezar a usar CS Storage, usted tiene que descargar nuestra applicacion con <a href="http://release.correosolucion.com/public/CSStorage.exe" target="_blank">este enlace</a>.(http://release.correosolucion.com/public/CSStorage.exe)</b></big><br/>
El proceso de descarga y de instalación le guiara hasta su primera operación aduanal archivada en la nube!<br/>
<br/>
<big><b>Para la consulta de sus operaciones, usted se podrá conectar en <a href="http://storage.correosolucion.com">esta página</a> (http://storage.correosolucion.com)</b></big><br/>
En esta pagina, usted podrá buscar, consultar, descargar o imprimir todos los archivos relacionados con sus operaciones de comercio exterior en un solo click.<br/>
<br/>
<big><b>Para un mejor uso de CS Storage usted puede consultar <a href="http://correosolucion.com/wp-content/uploads/2013/05/Guia-de-usuario-CS-Storage-Aduanas-v4.pdf">nuestra guía de usuario disponible en nuestra página web</a>.</b></big><br/>
<br/>
Gracias por su preferencia,
<p style="text-align: center;"><span style="color: #1d93e2;"><strong><em>CS Storage by Correo Solución</em></strong></span></p>
<pre>Correo Solución Sa de Cv</pre>
<pre>Amsterdam 240, int 4,
Col Hipodromo Condesa
06100 Mexico DF
Tel: 55.63.63.32.81</pre>';
    return $message;
}
?>
