<?php
session_start();
?>

<!--LOCALISATION-->
<h1 id="titre-users">Administracion de los usuarios</h1>
<div id="users">
    <div class="container-tokens">
        <div id="tokens-OK" class="dialog-users">
            <p>Puedes crear <b id="nb-paid-users"/></b> <b>Usuario</b>(s)<span id="tokens-users-visitors"><br/><i><b>Visitantes</b> illimitados</i></span>.</p>
        </div>
        <div id="tokens-visitor" class="dialog-users">
            <p>Solo puedes crear usuarios "<b>Visitantes</b>".</p>
        </div>
        <div id="unpaid-users"><i>(<b id="nb-unpaid-users"></b> en espera de pago...)</i></div>
    </div>
    <div id="achat-users" class="bouton-achat">Comprar mas usuarios</div>
    <div style="clear: left;"></div>
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
                            <option value="0">Visitante</option>
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
        <div id="save-new-user" class="boutons back" data-user="new">Guardar usuario</div>
        <div style="clear: both;"></div>
    </div>
    <div style="clear: both;"></div>
    <ul id="liste-users"></ul>
</div>

<ul id="bucket-regles" class="liste-regles"></ul>
<div id="tip-niveau" class="container-arrow OK"></div>
