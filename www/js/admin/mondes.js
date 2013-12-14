

var bootstrap_monde = function() {
    var monde = profil.mondes[$("#liste-valeurs").attr("data-monde")];
    var champ = monde.champs[monde.cascade[0]];
    var label = champ.label;
    var pluriel = champ.pluriel;
    var ul = $("#liste-valeurs");
    
    $("#content-admin h1").text("Administracion de " + pluriel);
    $(".input-new-valeur").attr("placeholder", "Agregar un " + label); 
    ul.attr("data-champ", monde.cascade[0]);
    
    
    $("#liste-valeurs li").not("#new-valeur").remove();
    
    $.each(monde.references[0], function(i, reference) {
        affiche_valeur(i, 0, ul);
    });
    
    // Bind de boutons
    $(".add-new-valeur").unbind().click(save_valeur);
};

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
                "data-valeur": reference
            })
            .css("margin-left", marge + "%")
            .append(
                $("<img/>")
                .attr("src", "img/del.png")
                .addClass("valeur-del")
                .click(del_valeur)
            )
            .append(
                $("<img/>")
                .attr("src", "img/OK.png")
                .addClass("valeur-save")
                .click(save_valeur)
            )
            .append(
                $("<input></input>")
                .addClass("valeur")
                .val(valeur)
                .keyup(toggle_edit_valeur)
            );
            
    ul.append(li);
    
    // Si la valeur a des enfants, on remonte récursivement
    // en augmentant le niveau à chaque fois
    if (monde.references[reference] !== undefined) {
        var new_valeur = $("#new-valeur").clone().attr("id", "");
        var new_champ = monde.champs[monde.cascade[niveau + 1]];
        new_valeur.find("input").attr("placeholder", "Agregar un " + new_champ.label);
                        
        var new_ul = $("<ul></ul>")
                    .attr({
                        "data-parent": reference,
                        "data-champ": monde.cascade[niveau + 1]
                    })
                    .append(
                        new_valeur
                        .css("margin-left", ((niveau + 1) * 4) + "%")
                    );
                    
        ul.append(new_ul);
        
        $.each(monde.references[reference], function(i, enfant) {
            affiche_valeur(i, niveau + 1, new_ul);
        });
    }
    
};

var toggle_edit_valeur = function() {
    var input = $(this);
    var li = input.closest("li");
    
    input.addClass("modified");
    li.find(".valeur-save").fadeIn();
};

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
                _profil();
                bootstrap_monde();
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
                
                $.Zebra_Dialog(message, {
                    'type':     'question',
                    'title':    titre,
                    'buttons':  [bouton, 'Cancelar'],
                    'onClose':  function(caption) {
                        if (caption.indexOf("Confirmar") > -1) {
                            _del_valeur($("#liste-valeurs").attr("data-monde"), champ, pk, parent);
                        }
                    }
                });
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
                
                _profil();
                bootstrap_monde();
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
