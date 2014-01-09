

var tip_pass_params = function() {
    var field = $("#pass-params");
    var tip = $("#tip-pass-params");
    
    tip.fadeIn();
    
    tip_champ(field, tip);
};

var check_pass_params = function() {
    var field = $("#pass-params");
    var pass = field.val();
    var tip = $("#tip-pass-params");
    
    if (pass.length == 0) {
        if (field.hasClass("OK")) {
            field.removeClass("OK").addClass("KO");
        }
    } else {
        if (pass.length < 8) {
            field.removeClass("OK").addClass("KO");
            tip.html("Su contrasena debe ser un poco mas larga... (<b>8 caracteres minimum</b>)");
        } else {
            if (pass.length > 32) {
                field.removeClass("OK").addClass("KO");
                tip.html("No tenemos lugar por tanta contrasena! (<b>32 caracteres maximum</b>)");
            } else {
                if (countContain(pass, m_strUpperCase) == 0) {
                    field.removeClass("OK").addClass("KO");
                    tip.html("Su contrasena debe contener a lo menos una mayuscula!");
                } else {
                    if (countContain(pass, m_strLowerCase) == 0) {
                        field.removeClass("OK").addClass("KO");
                        tip.html("Su contrasena debe contener a lo menos una minuscula!");
                    } else {
                        if (countContain(pass, m_strNumber) == 0) {
                            field.removeClass("OK").addClass("KO");
                            tip.html("Su contrasena debe contener a lo menos un numero!");
                        } else {
                            if (countContain(pass, m_strCharacters) == 0) {
                                field.removeClass("OK").addClass("KO");
                                tip.html("Su contrasena debe contener a lo menos un caracter especial!");
                            } else {
                                field.removeClass("KO").addClass("OK");
                                tip.html("$*#} es una excelente contrasena!");
                            }
                        }
                    }
                }
            }
        }
    } 
    tip_pass_params();
};

var check_pass2_params = function() {
    var field = $("#pass2-params");
    
    var pass = $("#pass-params").val();
    var pass2 = field.val();
    
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

var confirme_password = function() {
    var pass = $("#pass-old").val();
    
    if (pass != "") {
        $(".arrow-params").fadeOut();
        $("#container-old-pass").hide();
        $("#container-new-pass").fadeIn();
    }
};

var change_password = function() {
    var pass = $("#pass-params");
    var pass2 = $("#pass2-params");
    
    if (pass.hasClass("OK") && pass2.hasClass("OK")) {
        $.ajax({
            url: "do/doChangePass.php",
            type: "POST",
            data: {
                oldPass: $("#pass-old").val(),
                newPass: pass.val()
            },
            statusCode: {
                200: function() {
                    $(".ZebraDialogOverlay").click();
                    popup("Su contrasena fue cambiada con exito!", "confirmation");
                },
                403: function() {
                    $("#container-new-pass").hide();
                    $("#container-old-pass").fadeIn();
                    tip_champ($("#container-old-pass"), $("#tip-old-pass-params").fadeIn());
                },
                500: function() {
                    popup("Error! Gracias por intentar otra vez...", "error");
                }
            }
        });
    }
};

var tip_mail_params = function() {
    var field = $("#mail-params");
    var tip = $("#tip-mail-params");
    
    tip.fadeIn();
    
    tip_champ(field, tip);
};

var confirme_password_mail = function() {
    var pass = $("#pass-old-mail").val();
    
    if (pass != "") {
        $(".arrow-params").fadeOut();
        $("#container-old-pass-mail").hide();
        $("#container-new-mail").fadeIn();
    }
};

var check_mail_params = function() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var field = $(this);
    var tip = $("#tip-mail-params");
    var mail = field.val();
    
    if (re.test(mail)) {
        field.removeClass("KO").addClass("OK");
        tip_mail();
    } else {
        field.removeClass("OK").addClass("KO");
        tip_mail();
    }
};

var change_mail = function() {
    var pass = $("#pass-old-mail");
    var mail = $("#mail-params");
    
    if (mail.hasClass("OK")) {
        $.ajax({
            url: "do/doChangeMail.php",
            type: "POST",
            data: {
                pass: pass.val(),
                mail: mail.val()
            },
            statusCode: {
                200: function() {
                    $(".ZebraDialogOverlay").click();
                    popup("Su correo electronico fue cambiada con exito!", "confirmation");
                },
                403: function() {
                    $("#container-new-mail").hide();
                    $("#container-old-pass-mail").fadeIn();
                    tip_champ($("#container-old-pass-mail"), $("#tip-old-pass-params-mail").fadeIn());
                },
                500: function() {
                    popup("Error! Gracias por intentar otra vez...", "error");
                }
            }
        });
    }
}
