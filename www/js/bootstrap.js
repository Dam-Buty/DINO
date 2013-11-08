var loginOK = 0;

var types = [
    { value: 0, text: "Cliente" },
    { value: 1, text: "Ejecutivo" },
    { value: 2, text: "Manager" },
    { value: 3, text: "Gerente" }
];

var bootstrap = function() {
    var HTMLMenu = "";
    $.ajax({ 
        url: "do/doGetProfile.php",
        statusCode: {
            500: function() {
                // Gestion erreur globale
            }
        }
    })
    .done(function (data) {
        profil = data;
        
        $(".div_login").hide();
        
        $.ajax({ url: "modules/core.php" })
        .done(function(data) {
            $("#content").append(data);
        });
        
        $.ajax({ url: "modules/queue.php" })
        .done(function(data) {
            $("#content").append(data);
        });
        
    });
    
};

var login = function() {
    if ($("#form_login").validationEngine("validate")) {
        
        $.ajax( {
            url: "do/doLogin.php",
            type: "POST",
            data: {
                login: $("#login").val(),
                password: $("#pass").val()
            },
            statusCode: {
                200: bootstrap,
                403: function(xhr) {
                    if (xhr.responseJSON.error == "login") {
                        $("#login").validationEngine("showPrompt", "Su nombre de usuario es desconocido", "error");
                    } else if (xhr.responseJSON.error == "pass") {
                        $("#pass").validationEngine("showPrompt", "Su contraseña es invalida", "error");
                    }
                },
                500: function() {
                    $("#bouton_login").validationEngine("showPrompt", "Un problema ha occurrido. Gracias por intentar otra vez.", "error");
                }
            }
        });
    }
};

$(document).ready(function(){
    $.ajax({ url: "do/doCheckLogin.php" })
        .done(function(data) {
            if (data.OK) {
                $(".div_login").hide();
                bootstrap();
            } else {
                $("#form_login").validationEngine('attach', {focusFirstField: true});
                $("#bouton_login").click(login);
            }
        }
    );
});
