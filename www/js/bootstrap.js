var loginOK = 0;

var scripts = [ "amenu.js",
                "jquery.counter.js",
                "jsonTable.js",
                "chosen.jquery.js",
                "tablesort.js",
                "zebra_dialog.js",
                "application.js" ];
                
var css = [ "amenu.css",
            "jquery.counter-analog.css",
            "chosen.css",
            "tablesort.css",
            "zebra_dialog.css"
          ];

var types = [
    { value: 0, text: "Cliente" },
    { value: 1, text: "Ejecutivo" },
    { value: 2, text: "Manager" },
    { value: 3, text: "Gerente" }
];

var clef_user = "";
var test_clef = "";

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
        profil.clef = decrypte_clef(profil.clef, clef_user);
        
        $.ajax({ url: "modules/menu.php" })
        .done(function(data) {
            HTMLMenu = data;
            
            $(".div_login").hide("slow");
            $("body").prepend(HTMLMenu);

            // Affiche le menu
            $('#amenu-list').amenu({
                'speed': 200,
                'animation': 'wind'       //  show, fade, slide, wind, none
            });
            
            // Initialise le compteur de credits
            $("#credit_counter").attr({ "data-stop": profil.credit }).counter();
            
            // Initialise les evenements de menu
            $('#logout').on('click', logOut);
            $('#archive').on('click', archive);
            $('#users').on('click', admin_users);
            $('#clients').on('click', admin_clients);
            $('#pass').on('click', modif_pass);
            $('#douanes').on('click', admin_douanes);
            $('#credits').on('click', admin_credits);
            
            $.ajax({ url: "modules/queue.php" })
            .done(function(data) {
                $("#amenu-wrapper").after(data);
            });
        });
    });
    
};

var login = function() {
    if ($("#form_login").validationEngine("validate")) {
        var pass_hash = custom_hash($("#pass").val());
        
        $.ajax( {
            url: "do/doLogin.php",
            type: "POST",
            data: {
                login: $("#login").val(),
                password: pass_hash
            },
            statusCode: {
                200: function(xhr) {
                    $("#jauge").show("slow");
                    loginOK = 1;
                    if ($("#jauge").progressbar( "value" ) === false) {
                        clef_user = custom_hash($("#login").val() + $("#pass").val() + xhr.mail);
                        bootstrap();
                    }
                },
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

var async_load = function() {
    $("#jauge").progressbar({ max: scripts.length + css.length, value: 0 });
    
    $("#jauge").on("one", function() {
        $("#jauge").progressbar("value", $("#jauge").progressbar( "value" ) + 1);
        if ($("#jauge").progressbar( "value" ) == $("#jauge").progressbar( "option", "max" )) {
            $("#jauge").trigger("finished");
        }
    });
    
    $("#jauge").on("finished", function() {
        $("#jauge").progressbar("value", false);
        if (loginOK) {
            bootstrap();
        }
    });

    $.each(scripts, function() {
        $.getScript("js/" + this)
            .done(function() {
                $("#jauge").trigger("one");
            })
            .fail(function() {
            });
    });
    
    $.each(css, function() {
        $('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'css/' + this
        }).appendTo('head');
        $("#jauge").trigger("one");
    });
};

$(document).ready(function(){
    $.ajax({ url: "do/doCheckLogin.php" })
        .done(function(data) {
            if (data.OK) {
                $(".div_login").hide();
                $("#jauge").show();
                loginOK = 1;
                async_load();
            } else {
                $("#form_login").validationEngine('attach', {focusFirstField: true});
                $("#bouton_login").click(login);
                
                // On commence à charger les scripts et les css, discret
                async_load();
            }
        }
    );
});
