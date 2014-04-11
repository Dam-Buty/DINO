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
<link rel="stylesheet" href="css/global.css?v=7" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/util.css?v=7" media="screen" type="text/css"/>
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />

</head>

<body>
<div id="front">
    <div id="laterale-front" class="barre-laterale">
        <a href="index.php"><h1>DINO</h1></a>
        <ul class="menu-lateral" id="menu-front">
            <li id="menu-queue" class="element-menu-front">
                <h1>CARGAR</h1>
            </li>
        </ul>
    </div>

    <div id="top-front" class="barre-top">
        <select class="busquedor" type="text" id="search" multiple="multiple" data-placeholder="Buscar en este mundo..." data-state="closed"></select>
        <div id="toggle-date"></div>
        <ul class="list-mondes" id="mondes-top"></ul>
        <div id="container-dates">
            <div id="slider-date"></div>
            <div id="text-date"></div>
        </div>
    </div>

    <div class="barre-bottom">
        <div id="container-notification">DINO esta en fase Beta, si encuentras algun bug o tienes cualquier pregunta, nos puedes contactar <a href="mailto:beta@dino.mx">aqui</a>.</div>
        <img id="logout" src="img/logout_20.png" title="Desconectar">
        <img id="bouton-pass" src="img/pass_20.png" title="Cambiar tu contrasena">
        <img id="bouton-mail" src="img/mail_20.png" title="Cambiar tu correo electronico">
    </div>
    
</div>

<div id="popup-welcome" class="dialog-box">
    <h1>Activa tu cuenta DINO</h1>
    <div class="popup-ligne"><div class="popup-jauge jauge-50"></div></div>
    <p>Has recibido un <b>mensaje de activacion</b> a <b><?php echo $_GET["mail"]; ?></b>.</p>
    <p>Da <u>click</u> en el enlace incluido y puedes comenzar a explorar DINO.</p>
</div>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-46251879-3', 'dino.mx');
  ga('send', 'pageview');

</script>

<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="vendor/html2canvas.js"></script>
<script src="vendor/StackBlur.js"></script>
<script type="text/javascript">

var blurred = false;

$("#front").fadeIn(function() {    
    $("body").append(
        $("<div></div>")
        .attr("id", "no-touchy-feely")
        .css({
            "overflow-y": "hidden"
        })
        .mousemove(function() {
            if (!blurred) {
                blurred = true;
                html2canvas($("body"), {
                    onrendered: function (canvas) {
                        $("#no-touchy-feely").append(canvas);
                        $("canvas").attr("id", "canvas");
                        stackBlurCanvasRGB(
                            'canvas',
                            0,
                            0,
                            $("canvas").width(),
                            $("canvas").height(),
                            5
                        );
                    }
                });
                
                $("#popup-welcome").fadeIn();
            }
        })
    );
});

</script>
</body>
</html>
