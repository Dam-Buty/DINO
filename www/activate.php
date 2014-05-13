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


</script>

</body>
</html>
