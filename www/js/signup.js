
var bootstrap_signup = function() {
    $("#mail").unbind();
    $("#mail").focus(tip_mail);
    $("#mail").keyup(check_mail).change(check_mail);
    
    $("#login").unbind();
    $("#login").focus(tip_login);
    $("#login").keyup(check_login).change(check_login);
    
    $("#pass").unbind();
    $("#pass").focus(tip_pass);
    $("#pass").keyup(check_pass).change(check_pass);
    
    $("#pass2").unbind();
    $("#pass2").keyup(check_pass2).change(check_pass2);
    
    $(".submit-signup").unbind().click(save_page);
};

var tip_mail = function() {
    $("#container-tips").html("<p>DINO nunca haria nada para lastimar un buzon inocente!</p>");
    tip_champ($("#mail"), $("#container-tips"));
};

var tip_login = function() {
    $("#container-tips").html("<p>Entre un nombre de usuario <b>entre 8 y 32 caracteres</b>.</p>");
    tip_champ($("#login"), $("#container-tips"));
};

var tip_pass = function() {
    $("#container-tips").html(
        "Su contrasena es la pieza clave de la seguridad de sus datos.<br/>" +
        "Una contrasena robusta contiene a lo menos 8 caracteres, incluyendo :<br/>" +
        "<ul>" +
            "<li>una <b>minuscula</b>,</li>" +
            "<li>una <b>MAYUSCULA</b>,</li>" + 
            "<li>un <b>numero</b></li>" + 
            "<li>y uno de esos <b>caracteres especiales</b> :</li>" + 
            "<li>!@#$%^&*?_~</li>" + 
        "</ul>" +
        "Por ejemplo : <b>Bacon_2013</b> es una deliciosa contrasena."
    );
    tip_champ($("#pass"), $("#container-tips"));
};

var check_signup = function() {
    if ($("#login").hasClass("OK") && $("#pass").hasClass("OK") && $("#pass2").hasClass("OK") && $("#mail").hasClass("OK")) {
        $('#container-signup input[type="submit"]').show();
        $("#container-tips").html(
            "<h1>Todo bueno !</h1>" +
                "<p>Da click en 'Ingresar' para continuar tu inscripcion</p>"
        );
    } else {
        $('#container-signup input[type="submit"]').hide();
    }
};

var save_page = function() {
    var submit = $(this);
    var data;
    
    switch(submit.attr("id").split("-")[2]) {
        case 1:
            data = {
                page: 1,
                mail: $("#mail").val(),
                login: $("#mail").val(),
                pass: $("#mail").val()
            }
            break;    
    };
    
    $.ajax({
        url: "do/doSignup.php",
        type: "POST",
        statusCode : {
            200: function() {
            
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Error! Gracias por intentar otra vez...", "error");
            }
        }
    })
};
