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

var mois = {
    "01": "Enero",
    "02": "Febrero",
    "03": "Marzo",
    "04": "April",
    "05": "Mayo",
    "06": "Junio",
    "07": "Julio",
    "08": "Agosto",
    "09": "Septiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre"
};

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
        //console.log(data);
        
        $(".div_login").hide();
        $("#front").show();
        
        // On binde les events
        $("#toggle-date").click(toggle_dates);
        $("#menu-queue").click(anime_queue);
        $("#new-monde").click(anime_queue);
//        $("#menu-cabinet").click(popup_cabinet);
//        $("#bouton-cabinet").click(request_monde);
        $("#documents-new-monde").focus(function() {
            $(this).select();    
            
            // Work around Chrome's little problem
            $(this).mouseup(function() {
                // Prevent further mouseup intervention
                $(this).unbind("mouseup");
                return false;
            });
        });
        
        $("#bouton-merci").click(function() {
            $(".ZebraDialogOverlay").click();
            $("#container-questions").show();
            $("#container-merci").hide();
        });
        
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
        
        $("#bouton-close-viewer").click(cancel_view);
        
        collapse_liste($("#edit-params"));
        
        $.ajax({ url: "modules/core.php" })
        .done(function(core) {
            $("#front").append(core);
            
            $.ajax({ url: "modules/queue.php" })
            .done(function(queue) {
                $("#front").append(queue);
                
                // On style les éléments                
                $("#date-store").datepicker({
                    dateFormat: "dd/mm/yy",
                    changeMonth: true,
                    changeYear: true
                });
                $("#date-store").datepicker('setDate', new Date());
                
                $("#container-details input").keydown(function(e) {
                    var code = e.keyCode ? e.keyCode : e.which;
                        
                    if (code == 13) {
                        archive_document();
                    }
                });
                
                $("#container-viewer-global").draggable({ handle: "div" }).resizable();
        
                $("#bouton-store").click(archive_document);
                $("#del-doc-store").click(remove_document_store);
                
                $("#del-all").click(remove_all_documents);
                
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
                                $("#core").append(monde);  
                            });
                            
                            $.ajax({ url: "modules/admin/profil.php" })
                            .done(function(profil) {
                                $("#core").append(profil);  
                            });
                            
                            bootstrap_admin();
                            $(window).trigger('resize');
                        },
                        403: function() {
                            $(window).trigger('resize');
                        }
                    }
                });
                
                bootstrap_tuto();
                
                // chat(); 
                // TODO : remettre chat
            });
        });
    });
    
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
        setTimeout(function() {
            container.css({
                left: (toggle.offset().left + 20 - (container.outerWidth() / 2) - $("#laterale-front") . outerWidth()) + "px"
            }).fadeIn();
        }, 105);
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

$( document ).keyup(function(e) {
    var code = e.keyCode ? e.keyCode : e.which;
        
    if (code == 27) {
        $("#opak").click();
        $("#opak-tuto").click();
    }
});
