<?php
session_start();
?>
<!--LOCALISATION-->
<h1 id="titre-users">Administracion de los usuarios</h1>
<div id="users">
    <div id="container-new-user">
        <div id="regles-new-user">
            <div style="display: none;"></div>
        </div>
        <div id="new-user">
            <div style="display: none;">
                <ul>
                    <li><input type="text" placeholder="Nombre de usuario" name="login" id="new-login">
                    </li>
                    <li><input type="password" placeholder="Contrasena" name="pass" id="new-pass">
                        
                    </li>
                    <li><input type="password" placeholder="Repetir contrasena" name="pass2" id="new-pass2"></li>
                    <li><input type="text" placeholder="Correo electronico" name="mail" id="new-mail"></li>
                    <li>
                        <select id="new-niveau" data-placeholder="Nivel de usuario...">
                            <option value=""></option>
                            <option value="0">Visitor</option>
                            <option value="10">Archivista</option>
            <?php if ($_SESSION["niveau"] >= 30) { ?>
                            <option value="20">Administrador</option>
            <?php } ?>
                        </select>
                    </li>
                    <li id="error-new-user">Todos los campos no estan llenos!</li>
                </ul>
            </div>
            <div>
                <div id="tip-login" class="container-error">Entre un nombre de usuario entre 8 y 32 caracteres.</div>
                <div id="tip-pass" class="container-error">Su contrasena es la pieza llave de la seguridad de sus datos.<br/>
                        Una contrasena robusta contiene a lo menos 8 caracteres, incluyendo una minuscula, una mayuscula, un numero y un caracter especial.<br/>
                        Por ejemplo : <b>Bacon_2013</b> es una deliciosa contrasena.</div>    
            </div>
        </div>
        <div style="clear: both;"></div> <!-- TODO : utiliser le clearboth pour plus avoir à resizer le popup store! -->
    </div>
    <div id="add-user" class="boutons">Crear usuario</div>
    <ul id="liste-users"></ul>
</div>

<ul id="bucket-regles" class="liste-regles"></ul>
