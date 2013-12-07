<?php
session_start();
?>
<!--LOCALISATION-->
<h1>Administracion de los usuarios</h1>
<div id="users">
    <div id="add-user" class="clickable">Agregar un usuario</div>
    <ul id="liste-users">
        <li id="new-user">
            <form id="form-new-user">
            <ul>
                <li><input type="text" placeholder="Nombre de usuario" name="login" id="new-login" 
                    class="validate[required,minSize[8],maxSize[20],ajax[checkuser]]"
                    data-errormessage-value-missing="El nombre de usuario es requirido."
                    data-errormessage-range-underflow="Su nombre de usuario debe contener a lo menos 8 caracteres." 
                    data-errormessage-range-overflow="Su nombre de usuario no puede contener mas de 20 caracteres."></li>
                <li><input type="password" placeholder="Contrasena" name="pass" id="new-pass"></li>
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
                <li><div id="new-regles" class="clickable">Editar reglas</div></li>
                <ul id="list-new-regles"></ul>
            </ul>
            </form>
        </li>
        <li id="edit-user">
        </li>
    </ul>
</div>
