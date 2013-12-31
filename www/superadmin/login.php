<?php
include("static/header.php");

// récupération des erreurs de login
if (isset($_GET["err"])) {
    if ($_GET["err"] == "login") {
        $message = "Su nombre de usuario es desconocido.";
    }
    else if ($_GET["err"] == "pass") {
        $message = "Su contraseña es invalida.";
        $username = $_GET["username"];
    }
}

?>
<script type="text/javascript">
function check_login(leForm) {
    document.getElementById("login_password_errorloc").innerHTML = ""
    document.getElementById("login_username_errorloc").innerHTML = ""
    if (leForm.username.value == "") {
        document.getElementById("login_username_errorloc").innerHTML = "Por favor entre un nombre de usuario valido."
        document.getElementById("username").focus();
        return false;
    }
    else {
        if (leForm.password.value == "") {
            document.getElementById("login_password_errorloc").innerHTML = "Por favor entre su contraseña."
            document.getElementById("password").focus();
            return false;
        }
        else {
            leForm.submit();
            return true;
        }
    }
}
</script>
<div class="form_login">
    <span id="login_error" class="error"><?php echo $message ?></span>
    <form name="leForm" action="do/doLogin.php" method="post" onsubmit="return check_login(this);">
        <div>
            <div class="col1">
                <label for='username' >Usuario :</label>
            </div>
            <input type='text' name='username' id='username' value='<?php echo $username; ?>' maxlength="50" /><br/>
            <div id='login_username_errorloc' class='error'></div>
                <br/>
            <div class="col1">
                <label for='password' >Contraseña:</label>
            </div>
            <input type='password' name='password' id='password' maxlength="50" /><br/>
            <div id='login_password_errorloc' class='error'></div>
                <br/>
            <input type='submit' name='Submit' value='Submit' />
        </div>
    </form>
</div>
<?
include("static/footer.php");
?>
