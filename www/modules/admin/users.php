<?php
session_start();
?>
<!--LOCALISATION-->
<h1 id="titre-users">Administracion de los usuarios</h1>
<div id="users">
    <div id="container-new-user">
        <div id="regles-new-user" style="display: none;">
            <div></div>
        </div>
        <div id="new-user">
            <div>
                <ul>
                    <li><input type="text" placeholder="Nombre de usuario" name="login" id="new-login">
                    </li>
                    <li><input type="password" placeholder="Contrasena" name="pass" id="new-pass">
                        
                    </li>
                    <li><input type="password" placeholder="Repetir contrasena" name="pass2" id="new-pass2"></li>
                    <li><input type="text" placeholder="Correo electronico" name="mail" id="new-mail"></li>
                    <li>
                        <select id="new-niveau" class="select-new-niveau" data-placeholder="Nivel de usuario...">
                            <option value=""></option>
                            <option value="0">Visitor</option>
                            <option value="10">Archivista</option>
            <?php if ($_SESSION["niveau"] >= 30) { ?>
                            <option value="20">Administrador</option>
            <?php } ?>
                        </select>
                    </li>
                </ul>
            </div>
            <div style="height: 0;">
                <div id="tip-login" class="container-arrow OK">
                </div>
                <div id="tip-pass" class="container-arrow OK">
                </div>
                <div id="tip-mail" class="container-arrow OK">
                </div>
                <div id="error-new-user" class="container-arrow KO">
                </div>
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>
    <div id="toggle-new-user" class="boutons back">Crear usuario</div><div id="save-new-user" class="boutons back" data-user="new">Guardar usuario</div>
    <div style="clear: both;"></div>
    <ul id="liste-users"></ul>
</div>

<ul id="bucket-regles" class="liste-regles"></ul>
