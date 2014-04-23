var bootstrap_users = function() {
    // Affecte les évènements des champs
    $("#new-login").unbind();
    $("#new-login").focus(tip_login);
    $("#new-login").keyup(check_login).change(check_login);
    
    $("#new-pass").unbind();
    $("#new-pass").focus(tip_pass);
    $("#new-pass").keyup(check_pass).change(check_pass);
    
    $("#new-pass2").unbind();
    $("#new-pass2").keyup(check_pass2).change(check_pass2);
    
    $("#new-mail").unbind();
    $("#new-mail").focus(tip_mail);
    $("#new-mail").keyup(check_mail).change(check_mail);
    
    $("#achat-users").unbind().click(popup_dinostore);
    
    if (profil.tokens.unpaid.users.length > 0) {
        $("#nb-unpaid-users").text(profil.tokens.unpaid.users.length);
        $("#unpaid-users").fadeIn();
    }
    
    // Style le combo
    $("#new-niveau").chosen({
        width: $("#new-login").outerWidth(),
        disable_search_threshold: 10,
        inherit_select_classes: true
    });
    
    $("#new-niveau").on("chosen:showing_dropdown", tip_niveau);
    $("#new-niveau").on("chosen:hiding_dropdown", kill_tip_niveau);
    $("#new-niveau").change(kill_tip_niveau);
    $("#new-niveau").change(toggle_niveau);
    
    $("#tokens-OK").unbind().click(toggle_new_user);
    $("#tokens-visitor").unbind().click(toggle_new_user);
    $("#save-new-user").unbind().click(save_user);
    
    Tuto.flag(0);
    
    refresh_users();
};


var refresh_users = function() {
    $("#new-user")
    .find("input")
        .removeClass()
        .val("");
        
    $("#new-niveau")
        .val("")
        .trigger("chosen:updated");
    
    $("#liste-regles")
    .find("[multiple]")
        .val("")
        .trigger("chosen:updated");
        
    $("#liste-regles")
    .find(".switch-me")
        .val("KO")
        .trigger("change");
    
    $("#toggle-new-user").text("Crear usuario");
    
    reset_tips();
    
    // Selon les tokens disponibles
    if (profil.tokens.paid.users.length > 0) {
        $("#nb-paid-users").text(profil.tokens.paid.users.length);
        $("#tokens-OK").fadeIn();
        $("#tokens-visitor").fadeOut();
        if (profil.tokens.visitor != 0) {
            $("#tokens-users-visitors").fadeIn();
        }
    } else {
        $("#new-niveau").change(buy_users);
        if (profil.tokens.visitor != 0) {
            $("#tokens-visitor").fadeIn();
            $("#tokens-OK").fadeOut();
        }
    }
    
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
                                    .text("Visitante")
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
                        niveau = "Visitante";
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
                                "data-state": "closed",
                                "data-token": user.token
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
                    $(".edit-niveau").unbind().change(buy_users).change(toggle_niveau);
    
                    $(".edit-niveau").on("chosen:showing_dropdown", tip_niveau);
                    $(".edit-niveau").on("chosen:hiding_dropdown", kill_tip_niveau);
                    $(".edit-niveau").change(kill_tip_niveau);
                                        
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
}

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
            "data-placeholder": "Limita sus accesos a ciertos " + champ.pluriel + ".",
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
    
    // Switche tous les mondes pour le new
    $("#regles-new-user select.switch-me").val("OK").trigger("change");
    
    // Switche les bons mondes pour chaque utilisateur
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
        "Entra un nombre de usuario <b>entre 8 y 32 caracteres</b>."
    );
    
    $("#tip-pass").html(
        "Tu contrasena es la pieza clave de la seguridad de tus datos.<br/>" +
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
        "DINO odia el SPAM! Tu correo electronico esta en seguridad con nosotros."
    );
    
    $("#tip-niveau").html(
        "El nivel de usuario determine las acciones disponibles para el usuario :<br/>" + 
            "<ul>" +
                "<li>Un <b>Visitante</b> solo puede <b>consultar</b> documentos.</li>" +
                "<li>Un <b>Archivista</b> puede <b>consultar</b> y <b>cargar</b> documentos.</li>" +
                "<li>Un <b>Administrator</b> puede <b>consultar</b> y <b>cargar</b> documentos, <b>crear usuarios</b> y <b>administrar</b> los datos documentales.</li>" +
            "</ul>"
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
    
    if (select.val() == "20") {
        ul.find(".tableau-regle").hide();
        ul.find(".tableau-regle select[multiple]").val("").change().trigger("chosen:updated");
    } else {
        ul.find('li[data-monde] option[value="OK"]:selected').closest("li").next("li").show();
    }
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
    if (div.find(".liste-regles .chosen-container").length == 0) {
        div.find(".switch-me").switchy(); // style les selects en switch
        div.find(".switch-me").on("change", toggle_monde);
        div.find("select[multiple]").chosen({
            inherit_select_classes: true
        });
        div.find(".switch-me").trigger("change");
    }
    
    Tuto.flag(2);
};

var toggle_monde = function() {
    var switchy = $(this);
    var li = switchy.closest("li");
    var ul = li.closest("ul");
    var div = ul.closest("div");
    var monde = profil.mondes[li.attr("data-monde")];
    var newli = li.next("li");
    
    if (div.hasClass("edit-regles")) { // EDIT
        niveau = div.parent("div").find("select").val();
    } else { // NEW
        niveau = div.parent("div").next("div").find("select").val();
    }
    
    if ($(this).val() == 'OK') {
        bgColor = '#B8DCB3';
        li.find("span").empty().append("Mundo <b>" + monde.label + "</b> :<br/> - El usuario tiene <b>acceso</b>");
        
        if (newli.find("select").val() != null) {
            li.find("span").append(
                " <b>unicamente a los " + monde.champs[monde.cascade[0]].pluriel + " siguientes</b> :"
            );
        } else {
            li.find("span").append(
                " <b>completo</b>"
            );
        }
        
        if (niveau != "20") {
            newli.show();
        } else {
            newli.hide();
        }
    } else if ($(this).val() == 'KO'){
        bgColor = '#DCB3B3';
        li.find("span").empty().append("Mundo <b>" + monde.label + "</b> :<br/> - El usuario <b>no tiene</b> acceso" );
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
    var token = li.attr("data-token");
    
    var message = "Estas seguro de querer borrar el usuario <b>" + login + "</b>? <br/>Esta accion es <b>irreversible</b>!";
    
    if (token != 0) {
        message += " <br/> <i>(Te devolvara <b>1</b> credito de <b>Usuario</b>)</i>";
    }
    
    var title = "Supresion de usuario";
    
    var bouton = "Confirmar (<i>borrar usuario</i>)";
    
    var callback = function() {
        $.ajax({
            url: "do/doDelUser.php",
            type: "POST",
            data: {
                login: login,
                token: token
            },
            statusCode : {
                204: function() {
                    popup("El usuario <b>" + login + "</b> fue borrado con exito.", "confirmation");
                    _profil(bootstrap_users);
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
    if ($("#container-new-user").is(":visible")) {
        $("#container-new-user").slideUp();
        $("#tokens-OK").removeClass("active");
        $("#toggle-new-user").text("Crear usuario"); // LOCALISATION
        $("#save-new-user").fadeOut();
    } else {
        $("#container-new-user").slideDown();
        $("#tokens-OK").addClass("active");
        // boutons
        $("#toggle-new-user").text("Cancelar creacion");
        if ($("#regles-new-user").is(":visible")) {
            $("#save-new-user").fadeIn();
        }
        
        Tuto.flag(1);
    }
};

var tip_niveau = function() {
    var select = $(this);
    var field = select.next("div");
    var tip = $("#tip-niveau");
    
    tip_champ(field, tip);
    
    if (Tuto.stage == 2) {
        Tuto._animations([{
            type: "highlight",
            selector: "#tip-niveau",
            force: true
        }])
    }
};

var kill_tip_niveau = function() {
    var tip = $("#tip-niveau");
    
    tip.fadeOut();
};

var tip_login = function() {
    var field = $("#new-login");
    var tip = $("#tip-login");
    
    tip_champ(field, tip);
};

var tip_pass = function() {
    var field = $("#new-pass");
    var tip = $("#tip-pass");
    
    tip_champ(field, tip);
};

var tip_mail = function(field, tip) {
    var field = $("#new-mail");
    var tip = $("#tip-mail");
    tip_champ(field, tip, true);
}

var save_user = function() {
    var div = $(this);
    var pk = div.attr("data-user");
    var token = 0, solde = 0;
    var niveau_source, niveau_cible, niveau;
    var li;
    
    if (pk == "new") {
        niveau = $("#new-niveau").val();
        
        if (profil.tokens.visitor != 0 && niveau == 0) {
            token = profil.tokens.visitor;
        } else {
            token = profil.tokens.paid.users[0];
            solde = -1;
        }
    } else {
        li = div.closest("li");
        
        niveau_source = Core.users[pk].niveau;
        niveau_cible = li.find(".edit-niveau").val();
        token = li.attr("data-token");
        
        // Consommation de tokens sur édition :
        // - Si on monte de niveau sur un user qui n'a pas de token
        //   >> - 1
        // - Si on baisse à visiteur un user qui a un token et que les visiteurs sont illimités
        //   >> + 1
        
        if (niveau_cible != niveau_source) {
            if (niveau_cible > niveau_source) {
                if (token == 0) {
                    solde = -1;
                    token = profil.tokens.paid.users[0];
                }
            } else {
                if (niveau_cible == 0) {
                    if (profil.tokens.visitor != 0 && token != 0) {
                        solde = 1;
                    }
                }
            }
        }
    }
    
    if (solde == 0) {
        _save_user(div, token, solde);
    } else {
        popup_transaction(solde, "user", function() {
            _save_user(div, token, solde);
        });
    }
};

var _save_user = function(div, token, solde) {
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
                token: token,
                solde: solde,
                droits: mondes_droits.join(",")
            },
            statusCode : {
                200: function() {
                    var splice_token;
                    
                    popup(message, "confirmation");
                    
                    if (solde != 0) {
                        // Supprime le token en mémoire
                        $.each(profil.tokens.paid.users, function(i, _token) {
                            if (_token == token) {
                                splice_token = i;
                                return false;
                            }
                        });
                        
                        profil.tokens.paid.users.splice(splice_token, 1);
                    }
                    
                    toggle_new_user();
                    _profil(refresh_users);
                },
                402: function() {
                    popup_buy_users($());
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

var buy_users = function() {
    var select = $(this);
    var niveau = select.val();
    
    if (niveau > 0 && profil.tokens.paid.users.length == 0) {
        popup_buy_users(select);
    }
};
