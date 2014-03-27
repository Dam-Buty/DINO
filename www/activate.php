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
<link rel="stylesheet" href="css/boutons.css" media="screen" type="text/css"/>
<link rel="shortcut icon" type="image/ico" href="favicon.ico" />
</head>

<body>
<?php
include("includes/PDO.php");
include("includes/status.php");
include("includes/log.php");

$query = "
    SELECT `login_user`
    FROM `user`
    WHERE 
        `mail_user` = :mail
        AND `activation_user` = :activation
;";

$params = [
    "mail" => $_GET["mail"],
    "activation" => $_GET["key"]
];

$result = dino_query($query, $params);

if ($result["status"]) {
    if (count($result["result"]) > 0) {
        $login = $result["result"][0]["login_user"];
        
        $query_activate = "
            UPDATE `user`
            SET `activation_user` = ''
            WHERE
                `login_user` = :login
        ;";
        
        $params_activate = [
            "login" => $login
        ];
        
        if (dino_query($query_activate, $params_activate)) {
         ?>
<div id="container-signup">
    <h1>Tu cuenta esta activada!</h1>
    <p>Ahora solo necesitas conectarte en DINO para empezar a mejorar tu vida documental!</p>
    <a href="index.php"><div class="boutons" id="bouton-activate">ENTRAR EN DINO</div></a>
</div>            
        <?php           
        } else {
            status(500);
            write_log([
                "libelle" => "ACTIVATION activate user",
                "admin" => 0,
                "query" => $query_activate,
                "statut" => 1,
                "message" => $result_activate["errinfo"][2],
                "erreur" => $result_activate["errno"],
                "document" => "",
                "objet" => $_GET["mail"]
            ]);
        }
        

    }
    else {
        ?>
<div id="container-signup">
    <h1>Error de activacion!</h1>
    <p>Tal vez tu cuenta ya ha sido activada, o tal vez hay una error en la direccion que entraste.</p>
    <p>Si encuentras problemas activando tu cuenta <b>DINO</b>, nos puedes contactar en <a href="mailto:beta@dino.mx">beta@dino.mx</a>!</p>
</div>    
        <?php
    }
} else {
    status(500);
    write_log([
        "libelle" => "ACTIVATION check user",
        "admin" => 0,
        "query" => $query,
        "statut" => 1,
        "message" => $result["errinfo"][2],
        "erreur" => $result["errno"],
        "document" => "",
        "objet" => $_POST["champ"]
    ]);
}

?>


</body>
</html>
