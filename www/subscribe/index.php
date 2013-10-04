<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
        "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
<head>
<meta http-equiv="Content-Type" content="application/xhtml+xml; 
        charset=utf-8" />
<title>CS Storage</title>
<meta content="2013-02-28" name="date" />
<meta content="Damien BUTY" name="author" />
<meta content="Pagina de accesso a sus archivos digitales" name="description" />
<link rel="stylesheet" href="css/inscription.css?v=1" media="screen" type="text/css"/>
<link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css?v=1" media="screen" type="text/css"/>
<link rel="stylesheet" href="../css/validationEngine.jquery.css?v=1" media="screen" type="text/css"/>
<link href='http://fonts.googleapis.com/css?family=Kavoon' rel='stylesheet' type='text/css'/>
<link href='http://fonts.googleapis.com/css?family=Bad+Script' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Happy+Monkey' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Podkova' rel='stylesheet' type='text/css'>

</head>
<body>
<div class="container-inscription">
    <div class="header-inscription">
        Bienvenido en su simulacion de costo CS Storage!
    </div>
    <div class="wrapper-inscription">
        <input type="hidden" id="pk"/>
        <div class="inscription-page" id="inscription-page-1">
            <form id="form-page-1">
                <h1>Para empezar, gracias por entrar su direccion de correo electronico y su numero telefonico.</h1>
                <p>Email</p>
                <input type="text" id="value_mail" value="bidule@gmail.com" class="validate[required,custom[email]]"/><br/>
                <img src="img/hr.png"/>
                <p>Telefono</p>
                <input type="text" id="value_tel" class="validate[required]"/><br/>
                <img src="img/hr.png"/>
                <p>Extension</p>
                <input type="text" id="value_ext" class=""/><br/>
            </form>
            <br/>
            <div class="bouton" id="submit-page-1">Continuar</div>
        </div>
        
        <div class="inscription-page" id="inscription-page-2" style="display: none;">
            <form id="form-page-2">
                <h1>Gracias por decirnos un poco mas sobre usted</h1>
                <p>Nombre</p>
                <input type="text" id="value_nom" class="validate[required]"/><br/>
                <img src="img/hr.png"/>
                <p>Empresa</p>
                <input type="text" id="value_entreprise" class="validate[required]"/><br/>
                <img src="img/hr.png"/>
                <p>Cargo</p>
                <input type="text" id="value_poste" class="validate[required]"/><br/>            
            </form>
            <br/>
            <div class="bouton" id="submit-page-2">Continuar</div>
        </div>
        
        <div class="inscription-page" id="inscription-page-3" style="display: none;">
            <form id="form-page-3">
                <h1>Estos datos nos permiten calcular la mejora oferta por sus necesidades</h1>
                <p>Con cuantos empleados cuenta su agencia?</p>
                <input type="text" id="value_nb_emp" class="validate[required,custom[number]]"/><br/>
                <img src="img/hr.png"/>
                <p>Cuantas operaciones al año realiza su agencia?</p>
                <input type="text" id="value_nb_op" class="validate[required,custom[number]]"/><br/>
                <img src="img/hr.png"/>
                <p>En cuantas aduanas opera su agencia?</p>
                <input type="text" id="value_nb_douanes" class="validate[required,custom[number]]"/><br/>
            </form>
            <br/>
            <div class="bouton" id="submit-page-3">Ver mi simulation</div>
        </div>
    </div>

    <div id="wrapper-simulation">
        <div class="bouton" id="contact-me">Mas informacion</div>
        <ul id="liste-simulation">
            <li id="badge-1">
                <span class="prix-total" id="prix-total-1"></span>
                <span class="nb-ope" id="nb-ope-1"></span>
                <span class="incluyendo">incluyendo</span>
                <span class="nb-ope-gratis" id="nb-ope-gratis-1">30</span>
                <span class="porope" id="porope-1"></span>
            </li>
            <li id="badge-2">
                <span class="prix-total" id="prix-total-2"></span>
                <span class="nb-ope" id="nb-ope-2"></span>
                <span class="incluyendo">incluyendo</span>
                <span class="nb-ope-gratis" id="nb-ope-gratis-2"></span>
                <span class="porope" id="porope-2"></span>
            </li>
            <li id="badge-3">
                <span class="prix-total" id="prix-total-3"></span>
                <span class="nb-ope" id="nb-ope-3"></span>
                <span class="incluyendo">incluyendo</span>
                <span class="nb-ope-gratis" id="nb-ope-gratis-3"></span>
                <span class="porope" id="porope-3"></span>
            </li>
        </ul>
    </div>
    <div id="call-us"></div>
</div>

<div id="div-temp" style="display: none;"></div>

<script src="../js/jquery-1.10.2.js?v=1"></script>
<script src="js/jquery-ui-1.10.3.custom.js?v=1"></script>
<script src="../js/jquery.validationEngine.js?v=1"></script>
<script src="../js/jquery.validationEngine-es.js?v=1"></script>

<script type="text/javascript">
var message1 = "Gracias por revisar sus datos y dar click en 'Pedir contacto', nuestro servicio comercial se comunicara personalmente con usted.";
var message2 = "Su volumen de actividad le da acceso a tarifas mas interesantes. Gracias por revisar sus datos y dar click en 'Pedir contacto', nuestro servicio comercial se comunicara personalmente con usted.";

var calcul_tarif = function(nb_op) {
    var tarif;
    var seuils = [ [ 0, 9 ], 
                   [ 3001, 8 ], 
                   [ 5001, 7 ], 
                   [ 10001, 6 ] ];
   
    $.each(seuils, function() {
        if (nb_op >= this[0]) {
            tarif = this[1];
        }
    });
    
    return nb_op * tarif;
}

var populated_form = 0;

var call_us = function(message) {
    // on blurre la simulation
    $("#wrapper-simulation").addClass("blur");
    
    // si nécessaire on peuple le formulaire
    if (!populated_form) {
        $("#call-us").empty()
            .append($("<div></div>").addClass("quit").click(function() {
                $("#call-us").hide("fast");
                $("#wrapper-simulation").removeClass("blur");
            }))
            .append("<h1></h1>")
            .append("<form id='form-contact'></form>")
            .append($("<div>Pedir contacto</div>").addClass("bouton").attr("id", "submit-contact"));
        
        $("#form-contact")
            .append($("<p>Su empresa : </p>").append($("#value_entreprise").detach()))
            .append('<img src="img/hr.png">')
            .append($("<p>Su nombre : </p>").append($("#value_nom").detach()))
            .append('<img src="img/hr.png">')
            .append($("<p>Email : </p>").append($("#value_mail").detach()))
            .append('<img src="img/hr.png">')
            .append($("<p>Telefono : </p>").append($("#value_tel").detach()))
            .append('<img src="img/hr.png">')
            .append($("<p>Extension : </p>").append($("#value_ext").detach()))
            .validationEngine('attach', {focusFirstField : false });
            
        $("#submit-contact").click(function() {
            if ($("#form-contact").validationEngine('validate')) {
                $.ajax({
                    url: "do/doSave.php",
                    type: "POST",
                    data: {
                        pk: $("#pk").val(),
                        page: 4,
                        mail: $("#value_mail").val(),
                        tel: $("#value_tel").val(),
                        ext: $("#value_ext").val(),
                        nom: $("#value_nom").val(),
                        entreprise: $("#value_entreprise").val()
                    }
                }).done(function() {
                    $("#div-temp").append($("#call-us input").detach());
                    $("#call-us").empty()
                    .append($("<div></div>").addClass("quit").click(function() {
                        $("#call-us").hide("fast");
                        $("#wrapper-simulation").removeClass("blur");
                    }))
                    .append("<p>Gracias por su preferencia. Nuestro servicio comercial le contactara en las proximas 48 horas.</p>");
                    populated_form = 0;
                });
            }
        });
    }
        
    // on centre le bloc call-us sur la page
    var top_wrapper = $("#wrapper-simulation").position().top;
    var top_contact = top_wrapper;
    
    var left_wrapper = $("#wrapper-simulation").position().left;
    var padding_left = ($("#wrapper-simulation").outerWidth() - $("#call-us").outerWidth()) / 2;
    var left_contact = left_wrapper + padding_left;
    
    console.log("Top : " + top_wrapper);
    console.log("Contact : " + top_contact);
    console.log("=====");
    console.log("Left : " + left_wrapper);
    console.log("Pad : " + padding_left);
    console.log("Contact : " + left_contact);
    console.log("=====");
    console.log("Width : " + $("#call-us").outerWidth());
    console.log("#####################################");
    
    $("#call-us h1").empty().text(message);
    
    $("#call-us")
        .css({ top: top_contact, left: left_contact })
        .show("fast");
    
    populated_form = 1;
}

var calcul_simulation = function(a, b) {
    var nb_op = $("#value_nb_op").val() * 1;
    
    if (nb_op >= 50000) {
        console.log("######");
        console.log("START");
        console.log("######");
        console.log(a);
        console.log(b);
        console.log("#####");
        call_us(message2); //!!!!
    } else {
        $("#call-us").hide("fast");
        $("#wrapper-simulation").removeClass("blur");
    }
    
    ////////////////////////////////////////////////
    /* CS Storage                                 */
    ////////////////////////////////////////////////
    
    /* Constantes de calcul                       */
    var credits_offerts = 0;
    if (nb_op >= 2000) {
        credits_offerts = 30;
    }
    var tarif_base = 10;

    var k2 = 0.1;
    var k3 = 0.15;
    
    /* Calculs */
    var op_mois = Math.ceil(nb_op / 12);
    
    var op_1 = op_mois;
    var gratis_1 = credits_offerts;
    var prix_1 = (op_1 - gratis_1) * tarif_base;
    var porope_1 = prix_1 / op_1;
    
    var payant_2 = op_mois * 3 / (1 + k2);
    var gratis_2 = Math.ceil(payant_2 * k2);
    var op_2 = payant_2 + gratis_2;
    var prix_2 = calcul_tarif(payant_2);
    var porope_2 = prix_2 / op_2;
    
    var payant_3 = op_mois * 6 / (1 + k3);
    var gratis_3 = Math.ceil(payant_3 * k3);
    var op_3 = payant_3 + gratis_3;
    var prix_3 = calcul_tarif(payant_3);
    var porope_3 = prix_3 / op_3;
    
    if (op_1 > 9999 || op_2 > 9999) {
        $(".nb-ope").css({ "font-size": "1.2em" });
    } else {
        $(".nb-ope").css({ "font-size": "1.4em" });
    }
    
    /* Affichage */
    
    $("#prix-total-1").text(Math.ceil(prix_1).toLocaleString());
    $("#nb-ope-1").empty().append("<big>" + Math.ceil(op_1) + "</big> operaciones");
    $("#nb-ope-gratis-1").empty().append("<big>" + Math.ceil(gratis_1) + "</big> gratis!");
    $("#porope-1").text(porope_1.toFixed(2));
    
    $("#prix-total-2").text(Math.ceil(prix_2).toLocaleString());
    $("#nb-ope-2").empty().append("<big>" + Math.ceil(op_2) + "</big> operaciones");
    $("#nb-ope-gratis-2").empty().append("<big>" + Math.ceil(gratis_2) + "</big> gratis!");
    $("#porope-2").text(porope_2.toFixed(2));
    
    $("#prix-total-3").text(Math.ceil(prix_3).toLocaleString());
    $("#nb-ope-3").empty().append("<big>" + Math.ceil(op_3) + "</big> operaciones");
    $("#nb-ope-gratis-3").empty().append("<big>" + Math.ceil(gratis_3) + "</big> gratis!");
    $("#porope-3").text(porope_3.toFixed(2));
    
    
    ////////////////////////////////////////////////
    /* Bodega                       */
    ////////////////////////////////////////////////
    
    /* Constantes de calcul                       
    
    var feuilles_op = 40;
    var feuilles_rame = 5000;
    var feuilles_toner = 5500;
    var feuilles_drum = 25000;
    
    var poids_feuille = 5;
    var poids_caisse = 150;
    
    var caisses_m2 = 36;
    var op_caisse = 30;
    
    var prix_rame = 450;
    var prix_toner = 1350;
    var prix_drum = 900;
    var prix_caisse = 17;
    var prix_m2 = 340 * 12 * 5; // archivage sur 5 ans 
    
    /* Calculs                                    
    
    var total_feuilles = feuilles_op * nb_op;
    var total_toners = Math.ceil(total_feuilles / feuilles_toner);
    var total_drums = Math.ceil(total_feuilles / feuilles_drum);
    var total_rames = Math.ceil(total_feuilles / feuilles_rame);
    var total_caisses = Math.ceil(nb_op / op_caisse);
    var total_poids = ((total_feuilles * poids_feuille) + (total_caisses * poids_caisse)) / 1000;
    var total_m2 = Math.ceil(total_caisses / caisses_m2);
    
    var cout_feuilles = total_rames * prix_rame;
    var cout_consommables = (total_toners * prix_toner) + (total_drums * prix_drum);
    var cout_caisses = total_caisses * prix_caisse;
    var cout_m2 = total_m2 * prix_m2;
    
    var cout_op_1 = (cout_feuilles + cout_consommables + cout_caisses) / nb_op;
    var cout_op_2 = (cout_feuilles + cout_consommables + cout_caisses + cout_m2) / nb_op;
    
    /* Affichage                                    
    
    $("#papel-hojas").text(total_feuilles.toLocaleString());
    $("#papel-pesos").text(cout_feuilles.toLocaleString());
    $("#consumibles-toner").text(total_toners.toLocaleString());
    $("#consumibles-drum").text(total_drums.toLocaleString());
    $("#consumibles-pesos").text(cout_consommables.toLocaleString());
    $("#metrics-cajas").text(total_caisses * 5);
    $("#metrics-kilos").text(Math.floor(total_poids * 5));
    $("#metrics-cuadrados").text(total_m2 * 5);
    $("#porope-1").text(cout_op_1.toFixed(2));
    $("#porope-2").text(cout_op_2.toFixed(2));
    */
}

var affiche_simulation = function() {
    
    if ($("body").outerWidth() < 700) {
        $("#wrapper-simulation").css("font-size", "0.7em");
    }
    
    $("#inscription-page-1").hide("fast").queue(function() {
        $(".container-inscription").animate({ width: "100%" });
        $(this).dequeue();
    }).queue(function() {
        $("#wrapper-simulation").show("fast");        
        $(this).dequeue();
    }).queue(function() {
        $("#value_nb_op")
            .detach()
            .appendTo($(".header-inscription").empty())
            .after("<p>Operaciones aduanales por <u>año</u></p>");
            
        $("#value_nb_op").spinner({
            stop: calcul_simulation
        });
        $("#inscription-page-3").hide();
        $(this).dequeue();
    });
    
    //$("#value_nb_op").keyup(calcul_simulation);
    
    calcul_simulation();
}

$(document).ready(function(){
    $("#form-page-1").validationEngine('attach', {focusFirstField : false });
    $("#form-page-2").validationEngine('attach', {focusFirstField : false });
    $("#form-page-3").validationEngine('attach', {focusFirstField : false });
    
    $("#submit-page-1").click( function() {
        if (!$("#value_mail").validationEngine('validate')) {
            $.ajax({
                url: "do/doCheckMail.php",
                type: "POST",
                data: {
                    mail: $("#value_mail").val()
                }
            }).done( function(data) {
                if (data.returning) {
                    $("#pk").val(data.pk);
                    $("#value_nb_op").val(data.op);
                    $("#value_entreprise").val(data.entreprise);
                    $("#value_nom").val(data.nom);
                    $("#value_mail").val(data.mail);
                    $("#value_tel").val(data.tel);
                    $("#value_ext").val(data.ext);
                    affiche_simulation()
                } else {
                    if ($("#form-page-1").validationEngine('validate')) {
                        $.ajax({
                            url: "do/doSave.php",
                            type: "POST",
                            data: {
                                page: 1,
                                mail: $("#value_mail").val(),
                                tel: $("#value_tel").val(),
                                ext: $("#value_ext").val()
                            }
                        }).done(function(insert_id) {
                            $("#pk").val(insert_id.pk);
                        });
                        
                        $("#inscription-page-1").hide("fast");
                        $("#inscription-page-2").show("fast");
                    }
                }
            });
        }
    });
    
    $("#submit-page-2").click( function() {
        if ($("#form-page-2").validationEngine('validate')) {
            $.ajax({
                url: "do/doSave.php",
                type: "POST",
                data: {
                    page: 2,
                    pk: $("#pk").val(),
                    nom: $("#value_nom").val(),
                    entreprise: $("#value_entreprise").val(),
                    poste: $("#value_poste").val()
                }
            });
            
            $("#inscription-page-2").hide("fast");
            $("#inscription-page-3").show("fast");
        }
    });
    
    $("#submit-page-3").click( function() {
        if ($("#form-page-3").validationEngine('validate')) {
            $.ajax({
                url: "do/doSave.php",
                type: "POST",
                data: {
                    page: 3,
                    pk: $("#pk").val(),
                    nb_emp: $("#value_nb_emp").val(),
                    nb_op: $("#value_nb_op").val(),
                    nb_douanes: $("#value_nb_douanes").val()
                }
            });
            
            affiche_simulation()
        }
    });
    
    $("#contact-me").click( function() {
        call_us(message1);
    });
});
</script>
</body>
</html>
