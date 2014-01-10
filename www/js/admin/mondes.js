

var bootstrap_monde = function() {
    var monde;

    if ($("#mondes-top-back li").length > 0) {
        monde = $('#mondes-top-back li[data-selected="1"]').index();
    } else {
        monde = 0;
    }
    
    $("#mondes-top-back").empty();
    
    $.each(profil.mondes, function(i, monde) {
        $("#mondes-top-back").append(
            $("<li></li>")
            .attr({
                "data-monde": i,
                "data-selected": 0
            })
            .text(monde.label)
            .click(change_monde_liste)
        );
    });

    $("#mondes-top-back").find("li").eq(monde).click();
    $("#mondes").fadeIn();
};

var change_monde_liste = function() {
    var li = $(this);    
    var monde = profil.mondes[li.attr("data-monde")];
    var champ = monde.champs[monde.cascade[0]];
    var label = champ.label;
    var pluriel = champ.pluriel;
    var ul = $("#liste-valeurs");
    
    // On met le monde en statut sélectionné
    li.closest("ul").find("li").attr("data-selected", "0");
    li.attr("data-selected", "1");
    
    // On met le monde dans liste-valeurs
    $("#liste-valeurs").attr("data-monde", li.attr("data-monde"));
    
    $("#mondes h1").text("Administracion de " + pluriel);
    $(".input-new-valeur").attr("placeholder", "Agregar un " + label).keyup(toggle_new_valeur); 
    ul.attr("data-champ", monde.cascade[0]);
    
    var lignes_ouvertes = [];
    
    // On stocke les lignes ouvertes
    $('#liste-valeurs li[data-state="open"]').each(function(i, ligne) {
        lignes_ouvertes.push([ $(ligne).attr("data-champ"), $(ligne).attr("data-valeur")]);
    });
    
    $("#liste-valeurs li").not("#new-valeur").remove();
    
    $.each(monde.references[0], function(i, reference) {
        affiche_valeur(i, 0, ul);
    });
    
    // Bind de boutons
    $(".add-new-valeur").unbind().click(save_valeur);
    
    collapse_liste($("#liste-valeurs"));
    
    $.each(lignes_ouvertes, function(i, ligne) {
        $('#liste-valeurs li[data-champ="' + ligne[0] + '"][data-valeur="' + ligne[1] + '"]').find("div").click();
    });
}

var affiche_valeur = function(reference, niveau, ul) {
    var monde = profil.mondes[$("#liste-valeurs").attr("data-monde")];
    var pk_champ = monde.cascade[niveau];
    var champ = monde.champs[pk_champ];
    var valeur = champ.liste[reference];
    var marge = niveau * 4;
    
    var li = $("<li></li>")
            .addClass("liste")
            .addClass("valeur")
            .attr({
                "data-champ": pk_champ,
                "data-valeur": reference,
                "data-niveau": niveau
            })
            .css("margin-left", marge + "%")
            .append(
                $("<img/>")
                .attr("src", "img/del_back_30.png")
                .addClass("valeur-del")
                .addClass("bouton-del-back")
                .click(del_valeur)
            )
            .append(
                $("<img/>")
                .attr("src", "img/save_back_30.png")
                .addClass("valeur-save")
                .addClass("bouton-save-back")
                .click(save_valeur)
            )
            .append(
                $("<input></input>")
                .addClass("valeur")
                .val(valeur)
                .keyup(toggle_edit_valeur)
            );
            
    ul.append(li);
    
    // S'il y a des sous-niveaux,  on affiche l'input pour ajout
    if (niveau + 1 in monde.cascade) {
        var new_valeur = $("#new-valeur").clone().attr("id", "");
        var new_champ = monde.champs[monde.cascade[niveau + 1]];
        new_valeur.find("input").attr("placeholder", "Agregar un " + new_champ.label).keyup(toggle_new_valeur);
                        
        var new_ul = $("<ul></ul>")
                    .attr({
                        "data-parent": reference,
                        "data-champ": monde.cascade[niveau + 1],
                        "data-niveau": niveau
                    })
                    .append(
                        new_valeur
                        .css("margin-left", ((niveau + 1) * 4) + "%")
                    );
                    
        ul.append(new_ul);
        
        // et les sous références s'il y en a    
        if (monde.references[reference] !== undefined) {
            
            $.each(monde.references[reference], function(i, enfant) {
                affiche_valeur(i, niveau + 1, new_ul);
            });
        }
    }    
};

var toggle_edit_valeur = function() {
    var input = $(this);
    var li = input.closest("li");
    
    if (input.val() == "") {
        input.removeClass("OK").addClass("KO");
        li.find(".valeur-save").fadeOut();
    } else {
        input.removeClass("KO").addClass("OK");
        li.find(".valeur-save").fadeIn();
    }
    
};

var toggle_new_valeur = function() {
    var input = $(this);
    
    if (input.val() == "") {
        input.next("span").fadeOut();
    } else {
        input.next("span").fadeIn();
    }
}

var save_valeur = function() {
    var monde = profil.mondes[$("#liste-valeurs").attr("data-monde")];
    var click = $(this);
    var li = click.closest("li");
    var champ, pk, parent, label, ul;
    
    if (click.hasClass("add-new-valeur")) {
        pk = "new";
        label = li.find("input").val();
        ul = li.closest("ul");
        champ = ul.attr("data-champ");
        parent = ul.attr("data-parent") || 0;
    } else {
        pk = li.attr("data-valeur");
        label = li.find("input").val();
        champ = li.attr("data-champ");
        parent = li.closest("ul").attr("data-parent") || 0;
    }
    
    $.ajax({
        url: "do/doSaveValeur.php",
        type: "POST",
        data: {
            monde: $("#liste-valeurs").attr("data-monde"),
            champ: champ,
            pk: pk,
            label: label,
            parent: parent
        },
        statusCode : {
            200: function() {
                popup("El " + monde.champs[champ].label + " " + label + " ha sido modificado con exito!", "confirmation");
                li.find("input").val("");
                _profil(bootstrap_monde);
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

var del_valeur = function() {
    var monde = profil.mondes[$("#liste-valeurs").attr("data-monde")];
    var img = $(this);
    var li = img.closest("li");
    var champ = li.attr("data-champ");
    var pk = li.attr("data-valeur");
    var parent = li.closest("ul").attr("data-parent") || 0;
    
    $.ajax({
        url: "do/doCheckValeur.php",
        type: "POST",
        data: {
            monde: $("#liste-valeurs").attr("data-monde"),
            champ: champ,
            pk: pk
        },
        statusCode : {
            200: function(documents) {
                var message = "";
                var bouton = "";
                var titre = "";
                
                if (documents > 0) {
                    message = "<b>" + documents + "</b> documentos estan asociados al " + monde.champs[champ].label + " <b>" + monde.champs[champ].liste[pk] + "</b>.<br/>Si usted pica 'Confirmar', el " + monde.champs[champ].label + " <b>" + monde.champs[champ].liste[pk] + "</b> sera borrado, estos documentos seran declasificados y regresaran en la fila de espera."; // LOCALISATION
                    bouton = 'Confirmar <i>(Declasificar <b>' + documents + '</b> documentos)</i>';
                    titre = 'Ojo, documentos orphanos!';
                } else {
                    message = "Gracias por confirmar la supresion del " + monde.champs[champ].label + " <b>" + monde.champs[champ].liste[pk] + "</b>";
                    bouton = "Confirmar";
                    titre = "Confirmar";
                }
                
                var callback = function() {
                    _del_valeur($("#liste-valeurs").attr("data-monde"), champ, pk, parent);
                };
                
                popup_confirmation(message, titre, bouton, callback);
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Error! Gracias por intentar otra vez...", "error");
            }
        }
    })
};

var _del_valeur = function(monde, champ, pk, parent) {
    $.ajax({
        url: "do/doDelValeur.php",
        type: "POST",
        data: {
            monde: monde,
            champ: champ,
            pk: pk,
            parent: parent
        },
        statusCode : {
            200: function() {
                popup("El " + profil.mondes[monde].champs[champ].label + " <b>" + profil.mondes[monde].champs[champ].liste[pk] + "</b> fue borrado con exito!", "confirmation");
                get_queue();
                _profil(bootstrap_monde);
            }
            ,
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Error! Gracias por intentar otra vez...", "error");
            }
        }
    });
};
