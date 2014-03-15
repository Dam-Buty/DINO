
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


