<?php
session_start();

if ($_SESSION["niveau"] == 999) {

 ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
        "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
<head>
<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=ISO-8859-1" />
<title>DINO</title>
<meta content="2013-02-28" name="date" />
<meta content="Damien BUTY" name="author" />
<meta content="Le Super Admin...." name="description" />

<link rel="stylesheet" href="css/superadmin.css?v=7" media="screen" type="text/css"/>

<link href='http://fonts.googleapis.com/css?family=Hammersmith+One' rel='stylesheet' type='text/css'>

<link rel="shortcut icon" type="image/ico" href="favicon.ico" />

</head>
<body>

<nav>
    <ul>
        <li id="tokens">Tokens</li>
        <li id="messages">Messages commerciaux</li>
        <li id="activate">Activation manuelle</li>
        <li id="moulinette">Moulinette users</li>
    </ul>
</nav>
<div style="clear: left;"></div>

<section>
    <article id="container-tokens">
        <header>On fait des cadeaux</header>
        <p>1 - Un client chanceux : <span id="tag-client-tokens"></span></p>
        <div id="container-client-tokens">
            <input type="test" id="search-tokens" placeholder="Search..."/>
            <ul id="list-clients-tokens" class="list-clients"></ul>
        </div>
        <div id="container-cadeau">
            <p>2 - Les cadeaux et les emplettes :</p>
            <table id="list-tokens-client">
                <thead>
                    <th>Date</th>
                    <th>Combo</th>
                    <th>Produit</th>
                    <th>Qte</th>
                    <th>Expiration</th>
                    <th>X</th>
                </thead>
                <tbody></tbody>
            </table>
            <p>3 - Le cadeau d'aujourd'hui</p>
            <p><select id="list-produits-tokens" class="list-produits"></select></p>
            <p>
                <label>Quantité : <input type="text" id="qte-cadeau"/></label><br/>
                <label>Mois : <input type="text" id="duree-cadeau"/></label><br/>
            </p>
            <p><input type="submit" value="Fais peter" id="submit-token"/></p>
        </div>
    </article>
    <article id="container-messages">
        <header>Everyday i'm hustlin'</header>
        <p><select id="list-messages"></select></p>
        <textarea id="message"></textarea>
        <p><input type="submit" value="Envoie du lourd"/></p>
    </article>
    <article id="container-activate">
        <header>A la mano</header>
        <input type="test" id="search-activate" placeholder="Search..."/>
        <ul id="list-users-activate"></ul>
    </article>
    <article id="container-moulinette">
        <header>Benny est un faignant</header>
        <p>1 - Un client chanceux : <span id="tag-client-moulinette"></span></p>
        <ul id="list-clients-moulinette" class="list-clients"></ul>
        <p>2 - Des trucs à mouliner</p>
        <textarea id="moulinage" rows="10" cols="80"></textarea>
        <p><label>MDP Gestionnaire : <input type="text" id="pass-moulinette"/></label></p>
        <p>Format : <b>Username</b>;<b>Mail</b>;<b>Monde</b>,<b>Monde</b>,...</p>
        <p><input type="submit" value="Mouline mouline" id="submit-moulinette"/></p>
    </article>
</section>

<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>

<script src="vendor/ckeditor/ckeditor.js"></script>

<script src="js/admin/superadmin.js?v=7"></script>

</body>
</html>

<?php }  else {
    dino_log([
        "niveau" => "Z",
        "query" => "Quelqu'un joue au superadmin!"
    ]);
    status(403);
}?>
