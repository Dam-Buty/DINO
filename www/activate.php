<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
        "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
<head>
<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
<title>DINO</title>
<meta content="2013-02-28" name="date" />
<meta content="Damien BUTY" name="author" />
<meta content="La revolucion documental" name="description" />
<link href='css/Oswald-Bold.ttf' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="css/signup.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/login.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/boutons.css" media="screen" type="text/css"/>
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />
</head>

<body>

<div id="container-loading" class="login-box">
    <img src="img/big_loader.gif"/>
</div>

<div id="container-signup">
    <div id="container-OK">
        <h1>Tu cuenta esta activada!</h1>
        <p>Ahora solo necesitas conectarte en DINO para empezar a mejorar tu vida documental!</p>
        <a href="index.php"><div class="boutons" id="bouton-activate">ENTRAR EN DINO</div></a>
    </div>
    <div id="container-KO">
        <h1>Error de activacion!</h1>
        <p>Tal vez tu cuenta ya ha sido activada, o tal vez hay una error en la direccion que entraste.</p>
        <p>Si encuentras problemas activando tu cuenta <b>DINO</b>, nos puedes contactar en <a href="mailto:beta@dino.mx">beta@dino.mx</a>!</p>
    </div>
</div>     
        
<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>

<script type="text/javascript">
$("#container-loading").show();
$("#container-signup").hide();

var arguments = {};

$.each(window.location.search.replace("?", "").split("&"), function(i, param) {
    var name = param.split("=")[0];
    var value = param.split("=")[1];
    
    arguments[name] = value;
})

$.ajax({
    url: "do/doActivate.php",
    data: {
        key: arguments.key,
        mail: arguments.mail
    },
    statusCode: {
        200: function() {
            $("#container-loading").hide();
            $("#container-OK").show();
            $("#container-signup").show();
        },
        204: function() {
            $("#container-loading").hide();
            $("#container-KO").show();
            $("#container-signup").show();
        },
        500: function() {
            $("#container-loading").hide();
            $("#container-KO").show();
            $("#container-signup").show();
        }
    }
})

</script>

</body>
</html>
