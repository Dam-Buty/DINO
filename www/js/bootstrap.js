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
        console.log(data);
        
        $(".div_login").hide();
        $("#front").show();
        
        // On binde les events
        $("#toggle-date").click(toggle_dates);
        $("#menu-queue").click(anime_queue);
        
        if (profil.printer != "") {
            $("#help-printer").fadeIn().click(help_printer);
        }
        
        $("#logout").fadeIn().click(logout);
        $("#bouton-pass").fadeIn().click(popup_pass);
        $("#bouton-mail").fadeIn().click(popup_mail);
        
        $("#pass-params").focus(tip_pass_params);
        $("#pass-params").keyup(check_pass_params);
        $("#pass2-params").keyup(check_pass2_params);
        
        $("#confirm-password").click(confirme_password);
        $("#change-password").click(change_password);
        
        $("#mail-params").focus(tip_mail_params);
        $("#mail-params").keyup(check_mail_params);
        
        $("#confirm-password-mail").click(confirme_password_mail);
        $("#change-mail").click(change_mail);
        
        collapse_liste($("#edit-params"));
        
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
                
                $("#container-viewer-global").draggable({ handle: "div" }).resizable();
                
                // On installe le drag'n'drop
                $("#zone-dnd").on("dragenter", dragenter_files);
                $("#zone-dnd").on("dragover", dragover_files);
                $("#zone-dnd").on("dragleave", dragleave_files);
                $("#zone-dnd").on("dragend", dragend_files);
                $("#zone-dnd").on("drop", drop_files);
                
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

var logout = function() {
    window.location.replace("logout.php");
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

$(document).ready(function(){
    bootstrap();
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
