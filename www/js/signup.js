var pk_client = 0;

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
    $("#container-tips").html("<p><i>No compartimos tu informacion</i>.</p>");
    tip_champ($("#mail"), $("#container-tips"), false, true);
};

var tip_login = function() {
    $("#container-tips").html("<p>Ingresa tu Nombre de usuario</p><p><i>(min. 8 caracteres)</i></p>");
    tip_champ($("#login"), $("#container-tips"));
};

var tip_pass = function() {
    $("#container-tips").html(
        "<p>Tus archivos son importantes.</p>" +
        "<p>Para una seguridad optima, tu contrasena debe tener :" +
        "<ul>" +
            "<li>min. 8 caracteres</li>" +
            "<li>una mayuscula y una minuscula</li>" + 
            "<li>un caracter especial</li>" + 
        "</ul>" +
        "<p><i><b>Pizza_2013</b> es una deliciosa contrasena.</i></p>"
    );
    tip_champ($("#pass"), $("#container-tips"));
};

var check_signup = function() {
    if ($("#login").hasClass("OK") && $("#pass").hasClass("OK") && $("#pass2").hasClass("OK") && $("#mail").hasClass("OK")) {
        $('#submit-page-1').show();
        $("#container-tips").html(
            "<h1>LISTO <img src='img/like_45.png'/></h1>"
        );
    } else {
        $('#submit-page-1').hide();
    }
};

var save_page = function() {
    var submit = $(this);
    var page = parseInt(submit.attr("id").split("-")[2]);
    var data, current, next;
    
    switch(page) {
        case 1:
            data = {
                page: page,
                mail: $("#mail").val(),
                login: $("#login").val(),
                pass: $("#pass").val()
            };
            current = $("#page-1");
            next = "end";
            break;    
    };
    
    $.ajax({
        url: "do/doSignup.php",
        type: "POST",
        data: data,
        statusCode : {
            200: function(pk) {
                pk_client = pk;
                
                if (next === "end") {
                    window.location.replace("welcome.php?mail=" + $("#mail").val());
                } else {
                    current.fadeOut(function() {
                        next.fadeIn();
                    });                
                }
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
