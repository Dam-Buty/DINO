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
<link rel="stylesheet" href="css/inputs.css?v=7" media="screen" type="text/css"/>
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />

</head>

<body>
<div id="front">
    <div id="laterale-front" class="barre-laterale">
        <a href="index.php"><h1></h1></a>
        <ul class="menu-lateral" id="menu-front">
            <li id="menu-queue" class="element-menu-front">
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

<?php
    $sub = array_shift(explode(".",$_SERVER['HTTP_HOST']));
    $ga = "";
    $mp = "";
    
    switch($sub) {
        case "baby":
            $ga = "UA-46251879-2";
            $mp = "6e55051c7ccd519d877791cf454ced7b";
            break;
        case "my":
            $ga = "UA-46251879-1";
            $mp = "869166a4cc76c76e609d760f484a2883";
            break;
        case "bym":
            $ga = "UA-49915836-1";
            $mp = "869166a4cc76c76e609d760f484a2883";
            break;
        default:
            $mp = "46582f9cfff2a4829acfc86efda788cf";
    }
?>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', '<?php echo $ga; ?>', 'dino.mx');
  ga('send', 'pageview');

</script>

<!-- start Mixpanel --><script type="text/javascript">(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
mixpanel.init("<?php echo $mp; ?>");

</script><!-- end Mixpanel -->
