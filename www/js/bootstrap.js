var loginOK = 0;

var types = [
    { value: 0, text: "Cliente" },
    { value: 1, text: "Ejecutivo" },
    { value: 2, text: "Manager" },
    { value: 3, text: "Gerente" }
];

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
        $("#files-handler").change(handle_files);
        
        // On style les éléments
        $("#switch-sort select").switchy().change(toggle_tri);
        $("#switch-sort").find(".switchy-bar").attr("data-tri", "ASC");
        
        $("#date-store").datepicker({dateFormat: "dd/mm/yy"});
        $("#date-store").datepicker('setDate', new Date());
        
        $.ajax({ url: "modules/core.php" })
        .done(function(data) {
            $("#front").append(data);
        });
        
        $.ajax({ url: "modules/queue.php" })
        .done(function(data) {
            $("#front").append(data);
        });
        
        $.ajax({ 
            url: "do/doCheckAdmin.php",
            statusCode: {
                200: function() {
                    $.ajax({ url: "modules/admin.php" })
                    .done(function(data) {
                        $("#back").append(data);
                    });
                }
            }
        });
        
        $(window).trigger('resize');
    });
    
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
// TODO : optimiser! 
$( window ).resize(function() {
    $("#core").animate({
        height: ($(window).height() - 132) + "px" // 61 px barre top
    });                                          // 31 px barre bottom + 40px padding
    
//    $("#viewer-store").css("height", 0.97 * $("#popup-store").innerHeight() + $("#popup-store").offset().top - $("#viewer-store").offset().top + "px");
//    $("#container-store").css("height", 0.97 * $("#popup-store").innerHeight() + $("#popup-store").offset().top - $("#viewer-store").offset().top + "px");
});
