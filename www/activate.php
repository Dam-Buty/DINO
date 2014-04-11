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
<link rel="stylesheet" href="css/global.css" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/util.css" media="screen" type="text/css"/>
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />
</head>

<body>

<div id="container-loading" class="login-box">
    <img src="img/big_loader.gif"/>
</div>

<div id="container-KO" class="dialog-box">
    <h1>Error de activacion</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-KO"></div></div>
    <p style="text-align: center; font-size: 1.1em;">Contactanos : <a href="mailto:beta@dino.mx">beta@dino.mx</a></p>
</div>     
        
<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>

<script type="text/javascript">
$("#container-loading").show();
$("#container-signup").hide();

var _arguments = {};

$.each(window.location.search.replace("?", "").split("&"), function(i, param) {
    var name = param.split("=")[0];
    var value = param.split("=")[1];
    
    _arguments[name] = value;
})

$.ajax({
    url: "do/doActivate.php",
    type: "POST",
    data: {
        user: _arguments.user,
        key: _arguments.key,
        mail: _arguments.mail
    },
    statusCode: {
        200: function() {
            window.location.replace("index.php?activated");
        },
        204: function() {
            $("#container-loading").hide();
            $("#container-KO").show();
            $("#container-OK").hide();
            $("#container-signup").show();
        },
        500: function() {
            $("#container-loading").hide();
            $("#container-KO").show();
            $("#container-OK").hide();
            $("#container-signup").show();
        }
    }
})

</script>

</body>
</html>
