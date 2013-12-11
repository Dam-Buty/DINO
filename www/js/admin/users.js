


var bootstrap_users = function() {
    // Récupère la liste des users
    $.ajax({
        url: "json/users.php",
        statusCode: {            
            200: function(users) {
                var ul = $("#liste-users");
                
                $.each(users, function(login, user) {
                     var niveau;
                     
                     if (user.niveau >= 0 && user.niveau < 10) {
                        niveau = "Visitor";
                     } else if (user.niveau >= 10 && user.niveau < 20) {
                        niveau = "Archivista";
                     } else if (user.niveau >= 20 && user.niveau < 30) {
                        niveau = "Administrador";
                     } else if (user.niveau >= 30) {
                        niveau = "Gerente";
                     }
                     
                     var li = $("<li></li>")
                            .addClass("liste")
                            .addClass("user")
                            .append(
                                $("<img/>")
                                .attr("src", "img/edit.png")
                                .addClass("user-edit")
                                .click(edit_user)
                            )
                            .append(
                                $("<img/>")
                                .attr("src", "img/key.png")
                                .addClass("user-key")
                                .click(key_user)
                            )
                            .append(
                                $("<img/>")
                                .attr("src", "img/del.png")
                                .addClass("user-del")
                                .click(del_user)
                            )
                            .append(
                                $("<div></div>")
                                .addClass("label-liste")
                                .append(
                                    $("<h1></h1>")
                                    .text(login)
                                    .append(
                                        $("<i></i>")
                                        .text(" ( " + user.mail + " )")
                                    )
                                )
                                .append(
                                    $("<p></p>")
                                    .html("Un " + niveau + ".")
                                )
                            )
                            .append(
                                $("<div></div>")
                                .addClass("edit")
                                .addClass("edit-user")
                                .append(
                                    $("<input/>")
                                    .attr({
                                        type: "text",
                                        placeholder: "Correo electronico"
                                    })
                                    .addClass("edit-mail")
                                    .val(user.mail)
                                )
                                .append(
                                    $("<select></select>")
                                    .attr("data-placeholder", "Nivel de usuario...")
                                    .addClass("edit-niveau")
                                    .append(
                                        $("<option></option>")
                                        .attr("value", "")
                                    )
                                    .append(
                                        $("<option></option>")
                                        .attr("value", 0)
                                        .text("Visitor")
                                    )
                                    .append(
                                        $("<option></option>")
                                        .attr("value", 10)
                                        .text("Archivista")
                                    )
                                    .append(
                                        $("<option></option>")
                                        .attr("value", 20)
                                        .text("Administrator")
                                    )
                                    .append(
                                        $("<option></option>")
                                        .attr("value", 30)
                                        .text("Gerente")
                                    )
                                    .val(user.niveau)
                                )
                                .append(
                                    $("<div></div>")
                                    .addClass("clickable")
                                    .addClass("click-regles")
                                    .text("Editar reglas")
                                    .click(regles_edit_user)
                                )
                                .append(
                                    $("<div></div>")
                                    .addClass("edit-regles")
                                )
                                .append(
                                    $("<div></div>")
                                    .addClass("clickable")
                                    .text("Guardar")
                                    .click(save_edit_user)
                                )
                            );
                        ul.append(li);
                    });
                    
                    // Bind d'events
                    $(".click-regles").unbind().click(toggle_regles);
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
    $("#save-user").unbind().click(save_user);
    
    bootstrap_regles();
};

var bootstrap_regles = function() {
    var ul = $("#bucket-regles");
    
    $.each(profil.mondes, function(i, monde) {
        var champ = monde.champs[monde.cascade[0]];
        var li = $("<li></li>")
                .attr("data-monde", i)
                .append(
                    $("<span></span>")
                    .text(monde.label)
                )
                .append(
                    $("<select></select>")
                    .addClass("switch-me")
                    .click(toggle_monde)
                    .append(
                        $("<option></option>")
                        .attr("value", "KO")
                        .text("KO")
                    )
                    .append(
                        $("<option></option>")
                        .attr("value", "OK")
                        .text("OK")
                    )
                );
                
        var newli = $("<li></li>").addClass("tableau-regle");
        
        var select = $("<select></select>").attr({
            multiple: "multiple",
            "data-placeholder": "Elige unos " + champ.pluriel + " para limitar el acceso del usuario",
            "data-monde": li.attr("data-monde"),
            "data-champ": monde.cascade[0]
        });
        
        $.each(champ.liste, function(i, valeur) {
            select.append(
                $("<option></option>")
                .attr("value", i)
                .text(valeur)
            );
        });
        
        ul.append(li);
        ul.append(newli.append(select));
    });
    
    ul.clone().attr("id", "").appendTo($(".edit-regles"));
    ul.clone().attr("id", "").appendTo($("#regles-new-user"));
};


var toggle_regles = function() {
    var click = $(this);
    
    if (click.attr("id") == "new-regles") {
        div = $("#regles-new-user");
        ul = $("#liste-regles-new-user");
    } else {
        div = div.next("div");
        ul = div.find("ul");
    }
    
    
    if (div.is(":visible")) {
        div.slideUp();
    } else {
        div.slideDown({
            complete: function() {
                if (div.find(".switchy-container").length == 0) {
                    div.find(".switch-me").switchy(); // style les selects en switch
                    div.find(".switch-me").on("change", toggle_monde);
                    div.find("select[multiple]").chosen();
                }
            }
        });
    }
};

var toggle_monde = function() {
    var switchy = $(this);
    var li = switchy.closest("li");
    var monde = profil.mondes[li.attr("data-monde")];
    var champ = monde.champs[monde.cascade[0]];
    var newli;
    
    if ($(this).val() == 'OK') {
        bgColor = '#B8DCB3';
    } else if ($(this).val() == 'KO'){
        bgColor = '#DCB3B3';
        newli = li.next("li");
        newli.slideUp();
    }

    $(this).next("div").find('.switchy-bar').animate({
        backgroundColor: bgColor
    });
};

var edit_user = function() {
    var img = $(this);
    var li = img.closest("li");
    
    li.find(".edit")
    .slideDown()
    .find(".edit-niveau").chosen({
        inherit_select_classes: true,
        disable_search_threshold: 10
    });
};

var save_edit_user = function() {

};

var regles_edit_user = function() {

};

var key_user = function() {

};

var del_user = function() {

};

var toggle_new_user = function() {
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
    
    
    if ($("#new-user").is(":visible")) {
        $("#new-user").slideUp();
        $("#regles-new-user").slideUp();
    } else {
        $("#new-user").slideDown();
        // Style le combo
        $("#new-niveau").chosen({
            width: $("#new-login").outerWidth(),
            disable_search_threshold: 10
        }).change(function() {
            $(this).addClass("OK");
        });
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

var save_user = function() {
    var div = $(this);
    var pk = div.attr("data-pk");
    var message;
    var login, pass, mail, niveau, champs;
    champs = {};
    
    // Vérifie que les champs sont correctement renseignés
    var login_ok = $("#new-login").hasClass("OK");
    var pass_ok = $("#new-pass").hasClass("OK");
    var mail_ok = $("#new-mail").hasClass("OK");
    var niveau_ok = $("#new-niveau").hasClass("OK");
    
    if (login_ok && login_ok && login_ok && login_ok) {
        $("#error-new-user").slideUp();
        if (pk == "new") {
            login = $("#new-login").val();
            pass = $("#new-pass").val();
            mail = $("#new-mail").val();
            niveau = $("#new-niveau").val();
            
            // On récupère les champs sélectionnés
            $("#liste-regles-new-user li[data-monde]").each(function(i, li) {
                if ($(li).find("select").val() == "OK") {
                    var select = $(li).next("li").find("select");
                    champs[select.attr("data-monde")] = {
                        champ: select.attr("data-champ"),
                        valeurs: select.val()
                    };
                }
            });
            
            message = "El usuario " + login + " ha sido creado con exito!";
        }
        
        $.ajax({
            url: "do/doSaveUser.php",
            type: "POST",
            data: {
                pk: pk,
                login: login,
                pass: pass,
                mail: mail,
                niveau: niveau,
                champs: champs
            },
            statusCode : {
                200: function() {
                    popup(message, "confirmation");
                    $("#new-user").slideUp();
                    $("#regles-new-user").slideUp();
                    // Recharger affichage des users
                },
                403: function() {
                    window.location.replace("index.php");
                },
                500: function() {
                    popup("Error! Gracias por intentar otra vez...", "confirmation");
                }
            }
        });
    } else {
        $("#error-new-user").slideDown();
    }
    
};
