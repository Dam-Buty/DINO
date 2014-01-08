var loginOK = 0;

var Core = {
    admin: false,
    monde: 0,
    champs: {},
    recherche: [],
    limit: [0, 100],
    liste: [],
    dates: [],
    users: []
};

var m_strUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var m_strLowerCase = "abcdefghijklmnopqrstuvwxyz";
var m_strNumber = "0123456789";
var m_strCharacters = "!@#$%^&*?_~";

var bootstrap = function() {
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
        $("#front").show();
        
        // On binde les events
        $("#toggle-date").click(toggle_dates);
        $("#menu-queue").click(anime_queue);
        
        if (profil.printer != "") {
            $("#help-printer").fadeIn().click(help_printer);
        }
        
        $.ajax({ url: "modules/core.php" })
        .done(function(core) {
            $("#front").append(core);
            
            $.ajax({ url: "modules/queue.php" })
            .done(function(queue) {
                $("#front").append(queue);
                
                // On style les éléments
                $("#switch-sort select").switchy().change(toggle_tri);
                $("#switch-sort").find(".switchy-bar").attr("data-tri", "ASC");
                
                $("#date-store").datepicker({dateFormat: "dd/mm/yy"});
                $("#date-store").datepicker('setDate', new Date());
            
                $.ajax({ 
                    url: "do/doCheckAdmin.php",
                    statusCode: {
                        200: function() {
                            $.ajax({ url: "modules/admin/users.php" })
                            .done(function(users) {
                                $("#backoffice").append(users);  
                            });
                            
                            $.ajax({ url: "modules/admin/monde.php" })
                            .done(function(monde) {
                                $("#backoffice").append(monde);  
                            });
                            
                            $.ajax({ url: "modules/admin/profil.php" })
                            .done(function(profil) {
                                $("#backoffice").append(profil);  
                            });
                            
                            bootstrap_admin();
                            $(window).trigger('resize');
                        },
                        403: function() {
                            $(window).trigger('resize');
                        }
                    }
                });        
            });
        });
    });
    
};

var help_printer = function() {
    
};

var toggle_tri = function() {
    var select = $(this);
    var switchy = select.next("div").find(".switchy-bar");
    var tri = select.val();
    
    switchy.attr("data-tri", tri);
    
    charge_documents();
};

var toggle_dates = function() {
    var toggle = $(this);
    var container = $("#container-dates");
    
    if (container.is(":visible")) {
        container.fadeOut();
    } else {
        container.css({
            left: (toggle.offset().left + 20 - (container.outerWidth() / 2) - $("#laterale-front") . outerWidth()) + "px"
        }).fadeIn();
    }
};

var _profil = function(callback) {
    $.ajax({ 
        url: "do/doGetProfile.php",
        statusCode: {
            200: function(data) {
                profil = data;
                callback();
            }
        }
    })
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



// Au resize, on redimensionne ce qui est positionné en jQuery
$( window ).resize(function() {
    $("#core").css({
        height: ($(window).height() - 92) + "px" // 61 px barre top
    });
    
    $("#backoffice").css({
        height: ($(window).height() - 92) + "px" // 61 px barre top
    });                                          // 31 px barre bottom
});
