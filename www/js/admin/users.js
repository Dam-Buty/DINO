
var bootstrap_users = function() {
    // Récupère la liste des users
    $.ajax({
        url: "json/users.php",
        statusCode: {            
            200: function(users) {
                $.each(users, function(i, user) {
                     
                });
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de recuperacion de datos. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }   
    });
    
    // Affecte les boutons
    $("#add-user").unbind().click(toggle_new_user);
    $("#new-regles").unbind().click(toggle_regles);
    
    // Affecte les évènements des champs
    $("#new-login").unbind();
    $("#new-login").focus(tip_login);
    $("#new-login").keyup(check_login);
    
    $("#new-pass").unbind();
    $("#new-pass").focus(tip_pass);
    $("#new-pass").keyup(check_pass);
    
    $("#new-pass2").unbind();
    $("#new-pass2").keyup(check_pass2);
    
    $("#new-mail").unbind();
    $("#new-mail").keyup(check_mail);
    
    // Style le combo
    $("#new-user").find("#niveau").chosen({
        width: $("#new-login").outerWidth(),
        disable_search_threshold: 10
    });
};

var toggle_new_user = function() {
    if ($("#new-user").is(":visible")) {
        $("#new-user").slideUp();
    } else {
        $("#new-user").slideDown();
    }
};

var tip_login = function() {
    var field = $("#new-login");
    var tip = $("#tip-login");
    
    // LOCALISATION
    tip.fadeIn();
    
    if (field.hasClass("OK")) {
        setTimeout(function() {
            tip.fadeOut();
        }, 2000);
    }
};

var check_login = function() {
    var field = $("#new-login");
    var login = field.val();
    var tip = $("#tip-login");
    
    if (login.length == 0) {
        tip_login();
    } else {
        if (login.length < 8) {
            field.removeClass("OK").addClass("KO");
            tip.html("Su nombre de usuario debe ser un poco mas largo... (<b>8 caracteres minimum</b>)").slideDown().fadeIn();
        } else {
            if (login.length > 32) {
                field.removeClass("OK").addClass("KO");
                tip.html("No tenemos lugar por tanto nombre de usuario! (<b>32 caracteres maximum</b>)").slideDown().fadeIn();
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
                            tip.html("<b>" + login + "</b> es un excelente nombre, pero no esta disponible :(").slideDown().fadeIn();
                        },
                        404: function() {
                            field.removeClass("KO").addClass("OK");
                            tip.html("<b>" + login + "</b> es un excelente nombre!").slideDown().fadeIn();
                            setTimeout(function() {
                                tip.slideUp();
                                tip.fadeOut();
                            }, 2000);
                        },
                        403: function() {
                            window.location.replace("index.php");
                        },
                        500: function() {
                            tip.html('Error de verificacion. Gracias por intentar otra vez', 'error'); // LOCALISATION
                        }
                    }
                });
            }
        }
    }
};

var tip_pass = function() {
    var field = $("#new-pass");
    var tip = $("#tip-pass");
    
    // LOCALISATION
    tip.fadeIn();
    
    if (field.hasClass("OK")) {
        setTimeout(function() {
            tip.slideUp();
            tip.fadeOut();
        }, 2000);
    }
};

var check_pass = function() {
    var field = $("#new-pass");
    var pass = field.val();
    var tip = $("#tip-pass");
    
    if (pass.length == 0) {
        tip_pass();
    } else {
        if (pass.length < 8) {
            field.removeClass("OK").addClass("KO");
            tip.html("Su contrasena debe ser un poco mas larga... (<b>8 caracteres minimum</b>)").slideDown().fadeIn();
        } else {
            if (pass.length > 32) {
                field.removeClass("OK").addClass("KO");
                tip.html("No tenemos lugar por tanta contrasena! (<b>32 caracteres maximum</b>)").slideDown().fadeIn();
            } else {
                if (countContain(pass, m_strUpperCase) == 0) {
                    field.removeClass("OK").addClass("KO");
                    tip.html("Su contrasena debe contener a lo menos una mayuscula!").slideDown().fadeIn();
                } else {
                    if (countContain(pass, m_strLowerCase) == 0) {
                        field.removeClass("OK").addClass("KO");
                        tip.html("Su contrasena debe contener a lo menos una minuscula!").slideDown().fadeIn();
                    } else {
                        if (countContain(pass, m_strNumber) == 0) {
                            field.removeClass("OK").addClass("KO");
                            tip.html("Su contrasena debe contener a lo menos un numero!").slideDown().fadeIn();
                        } else {
                            if (countContain(pass, m_strCharacters) == 0) {
                                field.removeClass("OK").addClass("KO");
                                tip.html("Su contrasena debe contener a lo menos un caracter especial!").slideDown().fadeIn();
                            } else {
                                field.removeClass("KO").addClass("OK");
                                tip.html("$*#} es una excelente contrasena!").slideDown().fadeIn();
                                setTimeout(function() {
                                    tip.slideUp();
                                    tip.fadeOut();
                                }, 2000);
                            }
                        }
                    }
                }
            }
        }
    } 
};

var check_pass2 = function() {
    var field = $("#new-pass2");
    
    var pass = $("#new-pass").val();
    var pass2 = $("#new-pass2").val();
    
    if (pass.length == 0) {
        field.removeClass("OK").removeClass("KO");
    } else {
        if (pass2 != pass.substring(0, pass2.length)) {
            field.removeClass("OK").addClass("KO");
        } else {
            if (pass == pass2) {
                field.removeClass("KO").addClass("OK");
            } else {
                field.removeClass("OK").removeClass("KO");
            }
        }
    }
};

var check_mail = function() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var field = $("#new-mail");
    var tip = $("#tip-mail");
    var mail = field.val();
    
    if (re.test(mail)) {
        field.removeClass("KO").addClass("OK");
    } else {
        field.removeClass("OK").addClass("KO");
    }
};

var toggle_regles = function() {
    
};

