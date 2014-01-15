var bootstrap_users = function() {
    // Vide les champs de création si on vient de sauvegarder un user
    
    $("#mondes-top-back").empty();
    
    $("#new-user")
    .find("input")
        .removeClass()
        .val("")
        .end()
    .find("select")
        .val("")
        .trigger("chosen:updated")
        .end()
    ;
    
    $("#regles-new-user")
        .find("[multiple]")
            .val("")
            .trigger("chosen:updated")
            .end()
        .find(".switch-me")
            .val("KO")
            .trigger("change")
            .end()
    ;
    
    $("#toggle-new-user").text("Crear usuario");
    
    reset_tips();
    
    // Récupère la liste des users
    $.ajax({
        url: "json/users.php",
        statusCode: {            
            200: function(users) {
                var ul = $("#liste-users").empty();
                
                $("#regles-new-user").hide();
                $(".container-error").hide();
                $("#container-new-user").hide();

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
                    var div = $("<div></div>");
                                
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
                     
                    if (user.mondes.length == 0) {
                        div.html("Este <b>" + niveau + "</b> no tiene acceso a ningun documento!");
                            div.addClass("noaccess");
                    } else {
                        div.html("Un <b>" + niveau + "</b> con acceso a :");
                        
                        $.each(user.mondes, function(i, monde) {
                            if (profil.mondes[i] !== undefined) {
                                if (monde.length == 0) {
                                    div.append(
                                    "<p> - <b>todo</b> el mundo <b>" + profil.mondes[i].label + "</b>.</p>"
                                    );
                                } else {
                                    div.append(
                                    "<p> - <b>ciertos " + profil.mondes[i].champs[profil.mondes[i].cascade[0]].pluriel + "</b> del mundo <b>" + profil.mondes[i].label + "</b></p>"
                                    );
                                }
                            }
                        });
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
                                .addClass("bouton-del-back")
                                .attr("src", "img/del_back_30.png")
                                .addClass("user-del")
                                .click(del_user)
                            )
                            .append(
                                $("<img/>")
                                .addClass("bouton-key-back")
                                .attr("src", "img/key_back_30.png")
                                .addClass("user-key")
                                .click(key_user)
                            )
                            .append(
                                $("<img/>")
                                .addClass("bouton-edit-back")
                                .attr("src", "img/edit_back_30.png")
                                .addClass("user-edit")
                                .click(edit_user)
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
                                .append(div)
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
                                    .addClass("edit-regles")
                                    .append(
                                        $("<div></div>")
                                        .css("display", "none")
                                    )
                                )
                                .append(
                                    $("<div></div>")
                                    .addClass("boutons")
                                    .addClass("back")
                                    .addClass("save-user")
                                    .attr("data-user", login)
                                    .text("Guardar las modificaciones")
                                    .click(save_user)
                                )
                            );
                        ul.append(li);
                    });
                    
                    $("#titre-users").fadeIn();
                    $("#users").fadeIn();
                    
                    // Bind d'events
                    $("#toggle-new-user").unbind().click(toggle_new_user);
                    $("#save-new-user").unbind().click(save_user);
                    $("#new-niveau").unbind().change(toggle_niveau);
                    $(".edit-niveau").unbind().change(toggle_niveau);
                    
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
                )
                .append(
                    $("<span></span>") // LOCALISATION
                    .append("Mundo <b>" + monde.label + "</b>")
                );
                
        var newli = $("<li></li>").addClass("tableau-regle");
        
        var select = $("<select></select>").attr({
            multiple: "multiple",
            "data-placeholder": "Usted puede limitar el acceso a ciertos " + champ.pluriel + " seleccionandolos aqui.",
            "data-monde": li.attr("data-monde"),
            "data-champ": monde.cascade[0]
        })
        .addClass("select-regles")
        .change(toggle_limite);
        
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
    $(".edit-regles").empty().append(ul.clone().attr("id", ""));
    
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
    
    $(".select-regles").unbind().change(toggle_limite);
};

var reset_tips = function() {
    $("#tip-login").html(
        "Entre un nombre de usuario <b>entre 8 y 32 caracteres</b>."
    );
    
    $("#tip-pass").html(
        "Su contrasena es la pieza clave de la seguridad de sus datos.<br/>" +
        "Una contrasena robusta contiene a lo menos 8 caracteres, incluyendo :<br/>" +
        "<ul>" +
            "<li>una minuscula,</li>" +
            "<li>una MAYUSCULA,</li>" + 
            "<li>un numero</li>" + 
            "<li>y uno de esos caracteres especiales : !@#$%^&*?_~</li>" + 
            "</ul>" +
            "Por ejemplo : <b>Bacon_2013</b> es una deliciosa contrasena."
    );
    
    $("#tip-mail").html(
        "DINO would never, ever do anything to harm an innocent mailbox."
    );
    
    $("#error-new-user").html(
        "Todos los campos no estan llenos!"
    );
};

var toggle_limite = function() {
    var select = $(this);
    var li = select.closest("li");
    
    li.prev("li").find("select").change();    
};

var toggle_niveau = function() {
    var select = $(this);
    var niveau = select.val();
    var ul, click, div;
    
    if (select.attr("id") == "new-niveau") {
        ul = $(".liste-regles");
        click = $("#new-regles");
        div = $("#regles-new-user");
    } else {
        ul = select.nextAll(".edit-regles").find("ul");
        click = select.nextAll(".click-regles");
        div = select.nextAll(".edit-regles")
    }
    
    if (!div.is(":visible")) {
        toggle_regles(true);
    }
    
    select.addClass("OK");
    
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

var toggle_regles = function(isnew, user) {
    if (isnew) {
        div = $("#regles-new-user");
        $("#save-new-user").fadeIn();
        div.fadeIn();
    } else {
        div = $('li[data-user="' + user + '"]').find(".edit-user");
        div.slideDown();
    }
    
    // style les champs si ce n'est déjà fait
    if (div.find(".switchy-container").length == 0) {
        div.find(".switch-me").switchy(); // style les selects en switch
        div.find(".switch-me").on("change", toggle_monde);
        div.find("select[multiple]").chosen({
            inherit_select_classes: true
        });
        div.find(".switch-me").trigger("change");
    }
};

var toggle_monde = function() {
    var switchy = $(this);
    var li = switchy.closest("li");
    var monde = profil.mondes[li.attr("data-monde")];
    var newli = li.next("li");
    
    if ($(this).val() == 'OK') {
        bgColor = '#B8DCB3';
        li.find("span").empty().append("Mundo <b>" + monde.label + "</b> : el usuario tiene <b>acceso</b>");
        
        if (newli.find("select").val() != null) {
            li.find("span").append(
                " <b>unicamente a los " + monde.champs[monde.cascade[0]].pluriel + " siguientes</b> :"
            );
        } else {
            li.find("span").append(
                " <b>completo</b>"
            );
        }
        
        newli.show();
    } else if ($(this).val() == 'KO'){
        bgColor = '#DCB3B3';
        li.find("span").empty().append("Mundo <b>" + monde.label + "</b> : el usuario <b>no tiene</b> acceso" );
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
            .slideUp()
            .end()
        .find(".label-liste>div")
            .slideDown()
            .end()
        .animate({
            "background-position-x": "5px",
            "background-position-y": "50%"
        });
        
    } else {
        li.attr("data-state", "open")
        .find(".edit")
            .slideDown()
            .end()
        .find(".label-liste>div")
            .slideUp()
            .end()
        .animate({
            "background-position-x": "5px",
            "background-position-y": "5%"
        }, {
            complete: function() {
                li.animate({
                    "background-position-x": "5px",
                    "background-position-y": "5px"
                })
            }
        });
           
        if (li.find(".chosen-container").length == 0) {
            li.find(".edit")
            .find(".edit-niveau").chosen({
                inherit_select_classes: true,
                disable_search_threshold: 10
            });
        }
        
        toggle_regles(false, li.attr("data-user"));
    }
};

var key_user = function() {
    var click = $(this);
    var li = click.closest("li");
    var login = li.attr("data-user");
    var mail = li.attr("data-mail");
    
    var message = "La contrasena del usuario <b>" + login + "</b> esta a punto de ser reinicialisada. <br/>El usuario recibira su nueva contrasen en su mail <b>" + mail + "</b>.";
    
    var title = "Reinicialisacion de contrasena";
    
    var bouton = "Confirmar (<i>Reinicialisar contrasena</i>)";

    var callback = function() {
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
    
    popup_confirmation(message, title, bouton, callback);
};

var del_user = function() {
    var click = $(this);
    var li = click.closest("li");
    var login = li.attr("data-user");
    
    var message = "Estas seguro de querer borrar el usuario <b>" + login + "</b>? <br/>Esta accion es <b>irreversible</b>!";
    
    var title = "Supresion de usuario";
    
    var bouton = "Confirmar (<i>borrar usuario</i>)";
    
    var callback = function() {
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
    
    popup_confirmation(message, title, bouton, callback);
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
    $("#new-mail").focus(tip_mail);
    $("#new-mail").keyup(check_mail);
    
    if ($("#container-new-user").is(":visible")) {
        $("#container-new-user").slideUp();
        $("#container-new-user").slideUp();
        $("#toggle-new-user").text("Crear usuario"); // LOCALISATION
        $("#save-new-user").fadeOut();
    } else {
        $("#container-new-user").slideDown();
        
        // Style le combo
        $("#new-niveau").chosen({
            width: $("#new-login").outerWidth(),
            disable_search_threshold: 10,
            inherit_select_classes: true
        });
        
        // boutons
        $("#toggle-new-user").text("Cancelar creacion");
        if ($("#regles-new-user").is(":visible")) {
            $("#save-new-user").fadeIn();
        }
    }
};

var tip_login = function() {
    var field = $("#new-login");
    var tip = $("#tip-login");
    
    tip_champ(field, tip);
};

var check_login = function() {
    var field = $("#new-login");
    var login = field.val();
    var tip = $("#tip-login");
    
    if (login.length == 0) {
        if (field.hasClass("OK")) {
            field.removeClass("OK").addClass("KO");
            tip_login();
        }
    } else {
        if (login.length < 8) {
            field.removeClass("OK").addClass("KO");
            tip.html("Su nombre de usuario debe ser un poco mas largo... (<b>8 caracteres minimum</b>)");
            tip_login();
        } else {
            if (login.length > 32) {
                field.removeClass("OK").addClass("KO");
                tip.html("No tenemos lugar por tanto nombre de usuario! (<b>32 caracteres maximum</b>)");
                tip_login();
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
                            tip.html("<b>" + login + "</b> es un excelente nombre, pero no esta disponible :(");
                            tip_login();
                        },
                        404: function() {
                            field.removeClass("KO").addClass("OK");
                            tip.html("<b>" + login + "</b> es un excelente nombre!")
                           
                            tip_login();
                        },
                        403: function() {
                            window.location.replace("index.php");
                        },
                        500: function() {
                            field.removeClass("OK").addClass("KO");
                            tip.html('Error de verificacion. Gracias por intentar otra vez'); // LOCALISATION
                            tip_login();
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
    
    tip_champ(field, tip);
};

var check_pass = function() {
    var field = $("#new-pass");
    var pass = field.val();
    var tip = $("#tip-pass");
    
    if (pass.length == 0) {
        if (field.hasClass("OK")) {
            field.removeClass("OK").addClass("KO");
        }
        tip_pass();
    } else {
        if (pass.length < 8) {
            field.removeClass("OK").addClass("KO");
            tip.html("Su contrasena debe ser un poco mas larga... (<b>8 caracteres minimum</b>)");
            tip_pass();
        } else {
            if (pass.length > 32) {
                field.removeClass("OK").addClass("KO");
                tip.html("No tenemos lugar por tanta contrasena! (<b>32 caracteres maximum</b>)");
                tip_pass();
            } else {
                if (countContain(pass, m_strUpperCase) == 0) {
                    field.removeClass("OK").addClass("KO");
                    tip.html("Su contrasena debe contener a lo menos una mayuscula!");
                    tip_pass();
                } else {
                    if (countContain(pass, m_strLowerCase) == 0) {
                        field.removeClass("OK").addClass("KO");
                        tip.html("Su contrasena debe contener a lo menos una minuscula!");
                        tip_pass();
                    } else {
                        if (countContain(pass, m_strNumber) == 0) {
                            field.removeClass("OK").addClass("KO");
                            tip.html("Su contrasena debe contener a lo menos un numero!");
                            tip_pass();
                        } else {
                            if (countContain(pass, m_strCharacters) == 0) {
                                field.removeClass("OK").addClass("KO");
                                tip.html("Su contrasena debe contener a lo menos un caracter especial!");
                                tip_pass();
                            } else {
                                field.removeClass("KO").addClass("OK");
                                tip.html("$*#} es una excelente contrasena!");
                                tip_pass();
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

var tip_mail = function() {
    var field = $("#new-mail");
    var tip = $("#tip-mail");
    
    tip_champ(field, tip, true);
}

var check_mail = function() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var field = $(this);
    var tip = $("#tip-mail");
    var mail = field.val();
    
    if (re.test(mail)) {
        tip.html("El nombre de usuario y la contrasena seran enviados a esta direccion.");
        field.removeClass("KO").addClass("OK");
        tip_mail();
    } else {
        tip.html("DINO would never, ever do anything to harm an innocent mailbox.");
        field.removeClass("OK").addClass("KO");
        tip_mail();
    }
};

var save_user = function() {
    var div = $(this);
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
        
        // Récupère les mondes auxquels l'user a droit
        var mondes_droits = [];
        
        $.each(profil.mondes, function(i, monde) {
            mondes_droits.push(i);
        });
        
        $.ajax({
            url: "do/doSaveUser.php",
            type: "POST",
            data: {
                pk: pk,
                login: login,
                pass: pass,
                mail: mail,
                niveau: niveau,
                mondes: mondes,
                droits: mondes_droits
            },
            statusCode : {
                200: function() {
                    popup(message, "confirmation");
                    toggle_new_user();
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
    } else {
        div.addClass("KO");
        tip_champ(div, error);
    }
    
};
