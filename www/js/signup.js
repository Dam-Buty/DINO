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
    
//    $(".plan").mouseover(function() {
//        $(this).css("box-shadow", "0 0 1px 2px #5B8020");
//    }).mouseout(function() {
//        $(this).css("box-shadow", "");
//    }).click(save_plan);
};

var tip_mail = function() {
    $("#container-tips").html("<p>DINO odia el SPAM! Tu correo electronico esta en seguridad con nosotros.</p>");
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
            "<ul><li>!@#$%^&*?_~</li></ul>" + 
        "</ul>" +
        "Por ejemplo : <b>Bacon_2013</b> es una deliciosa contrasena."
    );
    tip_champ($("#pass"), $("#container-tips"));
};

var check_signup = function() {
    if ($("#login").hasClass("OK") && $("#pass").hasClass("OK") && $("#pass2").hasClass("OK") && $("#mail").hasClass("OK")) {
        $('#submit-page-1').show();
        $("#container-tips").html(
            "<h1>Listo!</h1>" +
                "<p>Da click para crear tu cuenta DINO!</p>"
        );
    } else {
        $('#submit-page-1').hide();
    }
};

var tip_page = function(page) {
    switch(page) {
        case 2:
            $("#container-tips").html(
                "<h1>Casi listo !</h1>" +
                "<p>Por favor dinos un poco mas sobre tu y tu empresa antes de <b>elegir tu plan</b>.</p>" +
                "<p>Estos datos <b>no son obligatorios</b>, pero nos permiten proporcionarte el servicio mas adecuado con tus necesidades.</p>"
            );
            $("#submit-page-2").fadeIn();
            break;
//        case 3:
//            $("#container-tips").hide();
//            $("#container-signup").animate({
//                width: "90%",
//                "margin-left": "5%"
//            });
//            $("body").animate({
//                "padding-top": "0"
//            });
//            $("#submit-page-3").fadeIn();
//            break;
    };
    $("#container-tips").css("top", "");
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
                        tip_page(page + 1);
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

var save_plan = function() {
    
};
