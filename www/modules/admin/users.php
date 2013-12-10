<?php
session_start();
?>
<!--LOCALISATION-->
<h1>Administracion de los usuarios</h1>
<div id="users">
    <div id="add-user" class="clickable">Agregar un usuario</div>
    <div id="new-user">
    <form id="form-new-user">
        <ul>
            <li><input type="text" placeholder="Nombre de usuario" name="login" id="new-login">
                <div id="tip-login" class="tip">Entre un nombre de usuario entre 8 y 32 caracteres.</div>
            </li>
            <li><input type="password" placeholder="Contrasena" name="pass" id="new-pass">
                <div id="tip-pass" class="tip">Su contrasena es la pieza llave de la seguridad de sus datos.<br/>
                Una contrasena robusta contiene a lo menos 8 caracteres, incluyendo una minuscula, una mayuscula, un numero y un caracter especial.<br/>
                Por ejemplo : <b>Bacon_2013</b> es una deliciosa contrasena.</div>    
            </li>
            <li><input type="password" placeholder="Repetir contrasena" name="pass2" id="new-pass2"></li>
            <li><input type="text" placeholder="Correo electronico" name="mail" id="new-mail"></li>
            <li>
                <select id="niveau" data-placeholder="Nivel de usuario...">
                    <option value=""></option>
                    <option value="0">Visitor</option>
                    <option value="10">Archivista</option>
<?php if ($_SESSION["niveau"] >= 30) { ?>
                    <option value="20">Administrador</option>
<?php } ?>
                </select>
            </li>
            <li><div id="new-regles" class="clickable"><p>Editar reglas</p></div></li>
            <ul id="list-new-regles"></ul>
        </ul>
    </form>
    <div id="regles-new-user">
    </div>
    </div>
</div>
