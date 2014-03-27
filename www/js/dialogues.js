
var popup = function(message, type) {
    
    new $.Zebra_Dialog(
        message, {
        'type': type,
        'buttons':  false,
        'modal': false,
        'width': Math.floor($(window).width() * 0.3),
        'position': ['right - 20', 'top + 20'],
        'auto_close': 3000
    });
};

var dialogue;

var popup_details = function(position) {
    var div = $("<div></div>");
    var ul = $("<ul></ul>")
    var document = queue[position];
    var store = document.store;
    var monde = profil.mondes[store.monde];
    var type;
    
    div
    .attr("id", "popup-details")
    .append(
        $("<p></p>")
        .html("Clasificacion del documento <b>" + document.displayname + "</b> :")
    );
    
    if (store.categorie == 0) {
        type = monde.champs[store.last_champ].types[store.type_doc.pk];
    } else {
        type = monde.champs[store.last_champ].categories[store.categorie].types[store.type_doc.pk];
    }
    
    ul.append(
        $("<li></li>")
        .html("Es un <b>" + type.label + "</b>")
    );
    
    $.each(store.champs, function(champ, valeur) {
        ul.append(
            $("<li></li>")
            .html("Del " + monde.champs[champ].label + " <b>" + monde.champs[champ].liste[valeur] + "</b>")
        );
    });
    
    div.append(ul);
    
    div.find("b").click(switch_to_store);
    
    div.append($("#container-details").show());

    dialogue = new $.Zebra_Dialog(
        "", {
            buttons: false, 
            type: false,
            source: {
                inline: div
            },
            overlay_close: false
        }
    );
    
    $("#bouton-store").fadeIn();
    
    $(".ZebraDialogOverlay").unbind().click(function(){
        var document = queue[$('li[data-editing="1"]').attr("data-position")];
        $("#container-details").detach().appendTo($("#container-store")).hide();
        document.li.addClass("done");
        document.li.attr("data-editing", 0);
        dialogue.close();
    });
};

var popup_pass = function() {
    dialogue = new $.Zebra_Dialog(
        "", {
            buttons: false,
            type: false,
            source: {
                inline: $("#container-change-pass").show()
            },
            overlay_close: false
        }
    );
    
    $(".ZebraDialogOverlay").unbind().click(function(){
        $("#container-change-pass").appendTo($("body")).hide();
        dialogue.close();
    });
};

var popup_mail = function() {
    dialogue = new $.Zebra_Dialog(
        "", {
            buttons: false,
            type: false,
            source: {
                inline: $("#container-change-mail").show()
            },
            overlay_close: false
        }
    );
    
    $(".ZebraDialogOverlay").unbind().click(function(){
        $("#container-change-mail").appendTo($("body")).hide();
        dialogue.close();
    });
};

var popup_confirmation = function(message, titre, bouton, callback) {
    $.Zebra_Dialog(message, {
        'type':     'question',
        'title':    titre,
        'buttons':  [bouton, 'Cancelar'],
        'onClose':  function(caption) {
            if (caption.indexOf("Confirmar") > -1) {
                callback();
            }
        }
    });
};

var popup_tuto = function(callback) {
    dialogue = new $.Zebra_Dialog(
        "No has terminado el tutorial, te gustaria retomarlo la proxima vez que te conectes?", {
            type: "question",
            overlay_close: false,
            'buttons':  [ {
                caption: 'Si', 
                callback: function() {}
            }, {
                caption: 'No', 
                callback: callback
            } ]
        }
    );
}

var popup_designer = function(callback) {
    if ($("#bouton-save-monde").is(":visible")) {
        $.Zebra_Dialog(
            "Tu mundo tiene modificacions que no publicaste. Si dejas esta pagina tus modificaciones seran perdidas.", {
            'type':     'question',
            'title':    "Modificaciones",
            'buttons':  ["Cancelar", 'Continuar (<i>borrar las modificaciones</i>)'],
            'onClose':  function(caption) {
                if (caption != "Cancelar") {
                    callback();
                    return true;
                } else {
                    $("#bouton-save-monde")
                    .tooltipster({
                        content: $("<p>Aqui para <b>Publicar</b> tu mundo!</p>"),
                        position: "top",
                        timer: 1200
                    })
                    return false;
                }
            }
        });
    } else {
        callback();
        return true;
    }
};

popup_activate = function() {
    $.Zebra_Dialog(
        '<h1>Tu cuenta no ha sido activada!</h1><p>Si no ves nuestro mail de activacion en tu correo electronico, pensa a revisar en el spam.</p><p>Si encuentras dificultidades activando tu cuenta, nos puedes contactar en <a href="mailto:beta@dino.mx">beta@dino.mx</a> .</p>', 
        {
            'type':     'error',
            'title':    'Error de activacion'
        }
    );
};
