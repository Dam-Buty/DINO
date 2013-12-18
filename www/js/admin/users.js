var bootstrap_users = function() {
    // Récupère la liste des users
    $.ajax({
        url: "json/users.php",
        statusCode: {            
            200: function(users) {
                var ul = $("#liste-users").empty();

                Core.users = users;                
                
                $.each(users, function(login, user) {
                     var niveau;
                     var select = $("<select></select>")
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
                                );
                                
                    if (profil.niveau >= 30) {
                        select.append(
                            $("<option></option>")
                            .attr("value", 20)
                            .text("Administrator")
                        );
                    }
                          
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
                            .attr({
                                "data-user": login,
                                "data-mail": user.mail,
                                "data-state": "closed"
                            })
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
                                    select
                                    .val(user.niveau)
                                )
                                .append(
                                    $("<div></div>")
                                    .addClass("clickable")
                                    .addClass("click-regles")
                                    .text("Editar reglas")
                                )
                                .append(
                                    $("<div></div>")
                                    .addClass("edit-regles")
                                    .append(
                                        $("<div></div>")
                                        .css("display", "none")
                                    )
                                )
                                .append(
                                    $("<div></div>")
                                    .addClass("clickable")
                                    .attr("data-user", login)
                                    .text("Guardar")
                                    .click(save_user)
                                )
                            );
                        ul.append(li);
                    });
                    
                    // Bind d'events
                    $(".click-regles").unbind().click(toggle_regles);
                    
                    // Affecte les boutons
                    $("#add-user").unbind().click(toggle_new_user);
                    $("#new-regles").unbind().click(toggle_regles);
                    $("#save-user").unbind().click(save_user);
                    $("#new-niveau").unbind().change(toggle_niveau);
                    $(".edit-niveau").unbind().change(toggle_niveau);
                    //$(".edit-mail").unbind()
                    
                    bootstrap_regles();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de recuperacion de datos. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }   
    });
    
};

var bootstrap_regles = function() {
    var ul = $("#bucket-regles").empty();
    
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
                        .attr({
                            value: "KO",
                            selected: "selected"
                        })
                        .text("KO")
                    )
                    .append(
                        $("<option></option>")
                        .attr({
                            value: "OK"/*,
                            selected: "selected"*/
                        })
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
    ul.clone().attr("id", "").appendTo($("#regles-new-user>div").empty());
    $(".edit-regles>div").empty().append(ul.clone().attr("id", ""));
    
    $.each(Core.users, function(i, user) {
        $.each(user.mondes, function(monde, valeurs) {
            $('li[data-user="' + i + '"]')
            .find('li[data-monde="' + monde + '"]')
            .find("select")
                .val("OK")
                .trigger("change")
                .end()
            .next("li")
            .find("select")
            .val(valeurs)
            .trigger("chosen:updated")
        });
    });
};

var toggle_niveau = function() {
    var select = $(this);
    var niveau = select.val();
    var ul, click, div;
    
    if (select.attr("id") == "new-niveau") {
        ul = $(".liste-regles");
        click = $("#new-regles");
        div = $("#regles-new-user>div");
    } else {
        ul = select.nextAll(".edit-regles").find("ul");
        click = select.nextAll(".click-regles");
        div = select.nextAll(".edit-regles")
    }
    
    if (!div.find("div").is(":visible")) {
        click.click();
    }
    
    $.each(profil.mondes, function(i, monde) {
        if (monde.niveau <= niveau) {
            ul.find('li[data-monde="' + i + '"]')
            .find("select").val("OK").trigger("change");
        } else {
            ul.find('li[data-monde="' + i + '"]')
            .find("select").val("KO").trigger("change");
        }
    });
};

var toggle_regles = function() {
    var click = $(this);
    
    if (click.attr("id") == "new-regles") {
        div = $("#regles-new-user>div");
    } else {
        div = click.next("div").children("div");
    }
    
    if (div.is(":visible")) {
        div.slideUp().fadeOut();
    } else {
        div.fadeIn();
        // style les champs si ce n'est déjà fait
        if (div.find(".switchy-container").length == 0) {
            div.find(".switch-me").switchy(); // style les selects en switch
            div.find(".switch-me").on("change", toggle_monde);
            div.find("select[multiple]").chosen();
            
//            div.find('.switchy-bar').animate({
//                backgroundColor: "#DCB3B3"
//            });
//            div.find("li.tableau-regle").hide();
            div.find(".switch-me").trigger("change");
        }
    }
};

var toggle_monde = function() {
    var switchy = $(this);
    var li = switchy.closest("li");
    var monde = profil.mondes[li.attr("data-monde")];
    var champ = monde.champs[monde.cascade[0]];
    var newli = li.next("li");
    
    if ($(this).val() == 'OK') {
        bgColor = '#B8DCB3';
        newli.show();
    } else if ($(this).val() == 'KO'){
        bgColor = '#DCB3B3';
        newli.hide();
    }

    $(this).next("div").find('.switchy-bar').animate({
        backgroundColor: bgColor
    });
};

var edit_user = function() {
    var img = $(this);
    var li = img.closest("li");
    
    if (li.attr("data-state") == "open") {
        li.attr("data-state", "closed")
        .find(".edit")
            .slideUp();
        
    } else {
        li.attr("data-state", "open")
        .find(".edit")
            .slideDown();
        
        if (li.find(".chosen-container").length == 0) {
            li.find(".edit")
            .find(".edit-niveau").chosen({
                inherit_select_classes: true,
                disable_search_threshold: 10
            });
        }
    }
};

var key_user = function() {
    var click = $(this);
    var li = click.closest("li");
    var login = li.attr("data-user");
    var mail = li.attr("data-mail");


    $.ajax({
        url: "do/doKeyUser.php",
        type: "POST",
        data: {
            login: login,
            mail: mail
        },
        statusCode : {
            200: function() {
                popup("La contrasena del usuario <b>" + login + "</b> fue reinicialisada con exito. <br/>El recibira su nueva contrasena en la direccion de correo electronico <b>" + mail + "<b>", "confirmation");
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Error! Gracias por intentar otra vez...", "error");
            }
        }
    });
};

var del_user = function() {
    var click = $(this);
    var li = click.closest("li");
    var login = li.attr("data-user");
    
    $.ajax({
        url: "do/doDelUser.php",
        type: "POST",
        data: {
            login: login
        },
        statusCode : {
            204: function() {
                popup("El usuario <b>" + login + "</b> fue borrado con exito.", "confirmation");
                bootstrap_users();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Error! Gracias por intentar otra vez...", "error");
            }
        }
    });
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
    
    
    if ($("#new-user>div").is(":visible")) {
        $("#new-user>div").slideUp();
        $("#regles-new-user>div").slideUp();
    } else {
        $("#new-user>div").slideDown();
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
    var field = $(this);
    var mail = field.val();
    
    if (re.test(mail)) {
        field.removeClass("KO").addClass("OK");
    } else {
        field.removeClass("OK").addClass("KO");
    }
};

var save_user = function() {
    var div = $(this);
    var li = div.closest(li);
    var pk = div.attr("data-user");
    var message;
    var login, pass, mail, niveau, mondes;
    var all_ok, error;
    var div_user, list_user;
    mondes = {};
    
    if (pk == "new") {
        // Vérifie que les champs sont correctement renseignés
        all_ok = $("#new-login").hasClass("OK") && $("#new-pass").hasClass("OK") && $("#new-mail").hasClass("OK") && $("#new-niveau").hasClass("OK");
        login = $("#new-login").val();
        pass = $("#new-pass").val();
        mail = $("#new-mail").val();
        niveau = $("#new-niveau").val();
        message = "El usuario " + login + " ha sido creado con exito!";
        error = $("#error-new-user");
        liste_user = $("#regles-new-user li[data-monde]");
        
    } else {
        div_user = div.parent("div");
        all_ok = true;
        login = pk;
        pass = "";
        mail = "";
        error = $();
        niveau = div_user.find(".edit-niveau").val();
        message = "El usuario " + login + " ha sido modificado con exito!";
        liste_user = div_user.find("li[data-monde]");
    }
    
    // On récupère les champs sélectionnés
    liste_user.each(function(i, li) {
        if ($(li).find("select").val() == "OK") {
            var select = $(li).next("li").find("select");
            
            mondes[select.attr("data-monde")] = {
                champ: select.attr("data-champ"),
                valeurs: select.val()
            };
        }
    });
    
    if (all_ok) {
        error.slideUp();
        
        $.ajax({
            url: "do/doSaveUser.php",
            type: "POST",
            data: {
                pk: pk,
                login: login,
                pass: pass,
                mail: mail,
                niveau: niveau,
                mondes: mondes
            },
            statusCode : {
                200: function() {
                    popup(message, "confirmation");
                    $("#new-user>div").slideUp();
                    $("#regles-new-user>div").slideUp();
                    bootstrap_users();
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
        error.slideDown();
    }
    
};