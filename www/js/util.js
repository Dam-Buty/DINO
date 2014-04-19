var allowed_extensions = {
    "pdf": 1,
    "jpg": 1,
    "png": 1,
    "gif": 1,
    "doc": 1,
    "xls": 1,
    "ppt": 1,
    "docx": 1,
    "xlsx": 1,
    "pptx": 1,
    "zip": 1,
    "rar": 1,
    "odt": 1,
    "ps": 1,
    "eps": 1,
    "epub": 1,
    "mobi": 1
}

var pdf_extensions =  {
    "pdf": 1
};

var img_extensions =  {
    "jpg": 1,
    "png": 1,
    "gif": 1,
    "jpeg": 1,
    "psd": 1,
    "svg": 1,
    "ai": 1
};

var doc_extensions = {
    "doc": 1,
    "dot": 1,
    "odt": 1,
    "ott": 1,
    "sxw": 1,
    "stw": 1,
    "docx": 1,
    "dotx": 1,
    "xls": 1,
    "xlt": 1,
    "ods": 1,
    "ots": 1,
    "sxc": 1,
    "stc": 1,
    "xlsx": 1,
    "xltx": 1,
    "csv": 1,
    "odp": 1,
    "otp": 1,
    "sxi": 1,
    "sti": 1,
    "pps": 1,
    "ppt": 1,
    "ppsx": 1,
    "pptx": 1
};

var vid_extensions = {
    "mp4": 1,
    "avi": 1,
    "wmv": 1,
    "mov": 1,
    "divx": 1,
    "mkv": 1
};

var m_strUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var m_strLowerCase = "abcdefghijklmnopqrstuvwxyz";
var m_strNumber = "0123456789";
var m_strCharacters = "!@#$%^&*?_~";

// Checks a string for a list of characters
function countContain(string, reference)
{ 
    // Declare variables
    var nCount = 0;

    for (i = 0; i < string.length; i++) 
    {
        if (reference.indexOf(string.charAt(i)) > -1) 
        {
                nCount++;
        } 
    }

    return nCount; 
}

var collapse_liste = function(liste, default_state) {
    var toggle_line = function() {
        var click = $(this);
        var li = click.closest("li");
        
        if (li.attr("data-state") !== undefined) {
            if (li.attr("data-state") == "closed") {
                li.next("ul").slideDown();
                li.attr("data-state", "open");
            } else {
                li.next("ul").children('li[data-state="open"]').click();
                li.next("ul").slideUp();
                li.attr("data-state", "closed");
            }
        }
    };
    
    if (default_state === undefined) {
        default_state = "closed"
    }

    liste.find("li.liste").each(function(i, ligne) {
        if ($(ligne).next("ul").length != 0) {
            $(ligne).attr("data-state", default_state)
                .css("position", "relative")
                .append(
                    $("<div></div>")
                    .css({
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        left: 0,
                        width: "40px"
                    })
                    .css("cursor", "pointer")
                    .click(toggle_line)
                );
        }
    });
        
    if (default_state == "closed") {
        liste.find("ul").hide();
    }
};

var tip_champ = function(field, tip, ignore_KO, no_higher) {
    var delay = 1200;
    var top;
    
    if (ignore_KO === undefined) {
        ignore_KO = false;
    }
    
    if (no_higher === undefined) {
        no_higher = false;
    }
    
    // Si le champ est en premier affichage ou en erreur
    if (!field.hasClass("OK")) {
        $(".container-arrow").not(tip).hide();
        
        tip.show().css({ opacity: 0 });
        
        top = (field.offset().top + (field.outerHeight() / 2)) - (tip.outerHeight() / 2);
        
        if (no_higher) {
            top = Math.max(top, field.offset().top);
        }
        
        tip.offset({
            top: top
        });
        
        tip.css({
            opacity: 1
        });
        
        if (field.hasClass("KO") && !ignore_KO) {
            tip.removeClass("OK").addClass("KO");
        }
    } else { // Si le champ vient de passer OK, on le repositionne
             // parceque le texte a changé
        top = (field.offset().top + (field.outerHeight() / 2)) - (tip.outerHeight() / 2);
        
        if (no_higher) {
            top = Math.max(top, field.offset().top);
        }
        
        tip.offset({
            top: top
        });
        
        // Et on le passe en vert
        tip.removeClass("KO").addClass("OK");
        if (tip.attr("id") != "container-tips") {
            setTimeout(function() {
                tip.fadeOut();
            }, delay);
        }
    }
    
    if (field.hasClass("edit-niveau")) {
        tip.css({
            "z-index": 200,
            "left": "45%",
            "width": "45%"
        });
    } else {
        if (field.hasClass("select-new-niveau")) {
            tip.css({
                "z-index": 701,
                "left": "45%",
                "width": "45%"
            });
        } else {
            tip.css({
                "z-index": "",
                "left": "",
                "width": ""
            });
        }
    }
};

var check_mail = function() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var field = $(this);
    var mail = field.val();
    var tip;
    
    if (field.attr("id") == "new-mail") {
        tip = $("#tip-mail");
    } else {
        tip = $("#container-tips");
    }
    
    if (re.test(mail)) {
        tip.html("<p><i>No compartimos tu informacion</i>.</p>");
        field.removeClass("KO").addClass("OK");
        tip_champ(field, tip, true, true); 
        if (tip.attr("id") == "container-tips") {
            check_signup();
        }
    } else {
        tip.html("<p><i>No compartimos tu informacion</i>.</p>");
        field.removeClass("OK").addClass("KO");
        tip_champ(field, tip, true, true);
        if (tip.attr("id") == "container-tips") {
            check_signup();
        }
    }
};

var check_login = function() {
    var field = $(this);
    var login = field.val();
    var tip;
    
    if (field.attr("id") == "new-login") {
        tip = $("#tip-login");
    } else {
        tip = $("#container-tips");
    }
    
    if (login.length == 0) {
        if (field.hasClass("OK")) {
            field.removeClass("OK").addClass("KO");
            tip_champ(field, tip);
        }  
        if (tip.attr("id") == "container-tips") {
            check_signup();
        }
    } else {
        if (login.length < 8) {
            field.removeClass("OK").addClass("KO");
            tip.html("<p>Tu nombre de usuario debe ser mas largo...</p><p> <i>(min. 8 caracteres)</i></p>");
            tip_champ(field, tip);  
            if (tip.attr("id") == "container-tips") {
                check_signup();
            }
        } else {
            if (login.length > 32) {
                field.removeClass("OK").addClass("KO");
                tip.html("<p>No tenemos lugar para tanto nombre de usuario!</p><p> <i>(32 caracteres maximum)</i></p>");
                tip_champ(field, tip);  
                if (tip.attr("id") == "container-tips") {
                    check_signup();
                }
            } else {
                $.ajax({
                    url: "do/doCheckUser.php",
                    type: "GET",
                    data: {
                        login: login
                    },
                    statusCode: {
                        200: function() {
                            field.removeClass("OK").addClass("KO");
                            tip.html("<b>" + login + "</b> es un excelente nombre, pero ya es de otra persona :(");
                            tip_champ(field, tip);   
                            if (tip.attr("id") == "container-tips") {
                                check_signup();
                            }
                        },
                        404: function() {
                            field.removeClass("KO").addClass("OK");
                            tip.html("<b>" + login + "</b> es un excelente nombre!");
                                                       
                            tip_champ(field, tip); 
                            if (tip.attr("id") == "container-tips") {
                                check_signup();
                            }
                        },
                        403: function() {
                            window.location.replace("index.php");
                        },
                        500: function() {
                            field.removeClass("OK").addClass("KO");
                            tip.html('Error de verificacion. Gracias por intentar otra vez'); // LOCALISATION
                            tip_champ(field, tip);
                        }
                    }
                });
            }
        }
    }
};

var check_pass = function() {
    var field = $(this);
    var pass = field.val();
    var tip;
    
    if (field.attr("id") == "new-pass") {
        tip = $("#tip-pass");
    } else {
        tip = $("#container-tips");
    }
    
    if (pass.length == 0) {
        if (field.hasClass("OK")) {
            field.removeClass("OK").addClass("KO");
        }
    
        tip_pass();  
        if (tip.attr("id") == "container-tips") {
            check_signup();
        }
    } else {
        if (pass.length < 8) {
            field.removeClass("OK").addClass("KO");
            tip.html("<p>Tu contrasena debe ser mas larga...</p><p> <i>(min. 8 caracteres)</i></p>");
            tip_champ(field, tip);  
            if (tip.attr("id") == "container-tips") {
                check_signup();
            }
        } else {
            if (pass.length > 32) {
                field.removeClass("OK").addClass("KO");
                tip.html("No tenemos lugar por tanta contrasena! (<b>32 caracteres maximum</b>)");
                tip_champ(field, tip);  
                if (tip.attr("id") == "container-tips") {
                    check_signup();
                }
            } else {
                if (countContain(pass, m_strUpperCase) == 0) {
                    field.removeClass("OK").addClass("KO");
                    tip.html("Tu contrasena debe tener una mayuscula!");
                    tip_champ(field, tip);  
                    if (tip.attr("id") == "container-tips") {
                        check_signup();
                    }
                } else {
                    if (countContain(pass, m_strLowerCase) == 0) {
                        field.removeClass("OK").addClass("KO");
                        tip.html("Tu contrasena debe tener una minuscula!");
                        tip_champ(field, tip);  
                        if (tip.attr("id") == "container-tips") {
                            check_signup();
                        }
                    } else {
                        if (countContain(pass, m_strNumber) == 0) {
                            field.removeClass("OK").addClass("KO");
                            tip.html("Tu contrasena debe tener un numero!");
                            tip_champ(field, tip);  
                            if (tip.attr("id") == "container-tips") {
                                check_signup();
                            }
                        } else {
                            if (countContain(pass, m_strCharacters) == 0) {
                                field.removeClass("OK").addClass("KO");
                                tip.html("Tu contrasena debe tener un caracter especial!");
                                tip_champ(field, tip);    
                                if (tip.attr("id") == "container-tips") {
                                    check_signup();
                                }
                            } else {
                                field.removeClass("KO").addClass("OK");
                                tip.html("$*#} es una excelente contrasena!");
                                tip_champ(field, tip); 
                                if (tip.attr("id") == "container-tips") {
                                    check_signup();
                                }
                            }
                        }
                    }
                }
            }
        }
    } 
};

var check_pass2 = function() {
    var field = $(this);
    var pass, pass2;
    
    if (field.attr("id") == "new-pass2") {
        tip = $("#tip-pass");
        pass = $("#new-pass").val();
        pass2 = $("#new-pass2").val();
    } else {
        tip = $("#container-tips");
        pass = $("#pass").val();
        pass2 = $("#pass2").val();
    }
    
    if (pass.length == 0) {
        field.removeClass("OK").removeClass("KO");  
        if (tip.attr("id") == "container-tips") {
            check_signup();
        }
    } else {
        if (pass2 != pass.substring(0, pass2.length)) {
            field.removeClass("OK").addClass("KO");  
            if (tip.attr("id") == "container-tips") {
                check_signup();
            }
        } else {
            if (pass == pass2) {
                field.removeClass("KO").addClass("OK");    
                if (tip.attr("id") == "container-tips") {
                    check_signup();
                }
            } else {
                field.removeClass("OK").removeClass("KO");  
                if (tip.attr("id") == "container-tips") {
                    check_signup();
                }
            }
        }
    }
};

    
    
    
var debug_liste = function() {
    var stack = [];
    var monde = profil.mondes[Core.monde];
    var categorie = 0;
    var label_categorie = "";
    var niveau = 0;
    var label;
    
    $.each(Core.liste, function(i, ligne) {
        switch(ligne.type) {
            case "champ":
                label = monde.champs[monde.cascade[ligne.niveau]].liste[ligne.pk];
                categorie = 0;
                label_categorie = "";
                
                niveau = ligne.niveau;
                if (ligne.niveau + 1 == stack.length) {
                    stack[ligne.niveau] = label;
                } else {
                    if (ligne.niveau + 1 > stack.length) {
                        stack.push(label);
                    } else {
                        stack.length = ligne.niveau + 1;
                        stack[ligne.niveau] = label;
                    }
                }
                break;
            case "categorie":
                categorie = ligne.pk;
                label_categorie = monde.champs[monde.cascade[ligne.niveau - 1]].categories[ligne.pk].label;
                break;
            default:
                var type, retour;
                
                if (categorie == 0) {
                    type = monde.champs[monde.cascade[niveau]].types[ligne.type];
                } else {
                    type = monde.champs[monde.cascade[niveau]].categories[categorie].types[ligne.type];
                }
                
                label = type.label;
                
                retour = "";
                
                $.each(stack, function(i, champ) {
                   retour += "__" + champ;
                });
                
                if (categorie != 0) {
                    retour += "__" + label_categorie;
                }
                
                retour += "__" + label;
                retour = stack.length + " : " + retour;
                console.log(retour);
        }
    })  
};

var chat = function () { 
    var done = false; 
    var script = document.createElement('script'); 
    script.async = true; 
    script.type = 'text/javascript'; 
    script.src = 'https://www.purechat.com/VisitorWidget/WidgetScript'; 
    document.getElementsByTagName('HEAD').item(0).appendChild(script); 
    script.onreadystatechange = script.onload = function (e) { 
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) { 
            var w = new PCWidget({ 
                c: '15d4cfc0-8fae-4e70-8294-389f583f897f', 
                f: true 
            }); 
            done = true; 
            setTimeout(function() {
                $(".purechat-widget").tooltipster({
                    content: $("<p>El equipo DINO siempre esta disponible para ayudarte!</p><p>No dudes en venir platicar con nosotros.</p>"),
                    timer: 5000,
                    position: "top"
                }).tooltipster("show");
            }, 2000);
            
            setTimeout(function() {
                $(".purechat-widget").tooltipster("destroy");
            }, 17000);
        } 
    }; 
};
