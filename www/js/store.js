
// TODO : pour proposer des défauts intelligents au prochain tour
var Store = {

};

var change_monde_store = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var h1 = $(this);
    var ul = h1.closest("ul");
    var li = h1.closest("li");
    
    document.store.monde = li.attr("data-monde");
    document.store.champs = {};
    document.store.categorie = "";
    document.store.type_doc = {};
    
    ul.find("li").attr("data-selected", "0");
    
    li.attr("data-selected", "1");
    
    $("#container-details").hide();
    
    reload_champs();
};

var remove_champ_store = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var monde = document.store.monde;
    var cascade = profil.mondes[monde].cascade;
    var div = $(this);
    var champ = $(this).parent().closest("div").attr("data-champ");
    
    document.store.champs[champ] = "";
    document.store.categorie = "";
    document.store.type_doc = {};
    
    var post = 0;
    
    // TODO : tester la remontée en cascade avec plus de 2 champs...
    $.each(cascade, function(i, champ_cascade) {
        if (post) {
            document.store.champs[champ_cascade] = "";
        } else {
            if (champ_cascade == champ) {
                post = 1;
            } else {
                document.store.last_champ = champ_cascade;
            }
        }
    });
    
    $("#container-details").hide();
    
    reload_champs();
};

var change_champ_store = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var select = $(this);
    var div = select.closest("div");
    var champ = div.attr("data-champ");
    var champ_profil = profil.mondes[document.store.monde].champs[champ];
    var valeur = select.val();
    
    // on stocke dans le store
    if (valeur != 0) {
        document.store.champs[champ] = valeur;
        document.store.last_champ = champ;
    }
    $("#container-details").hide();
    reload_champs();
};

var affiche_details = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var monde = document.store.monde;
    var detail = 0;
    var type;
    
    if (document.store.categorie == 0 || document.store.categorie == "") {
        type = profil.mondes[monde]
                .champs[document.store.last_champ]
                .types[document.store.type_doc.pk];
    } else {
        type = profil.mondes[monde]
                .champs[document.store.last_champ]
                .categories[document.store.categorie]
                .types[document.store.type_doc.pk]
    }
    
    if (type.detail == 1) {
        $("#input-detail").show();      
        $("#detail-store").autocomplete({
            source: type.details
        });
    } else {
        $("#input-detail").hide();
    }
    
    $("#bouton-store").unbind().click(archive_document);
    $("#container-details").show("slow");
};

var remove_type_store = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    
    document.store.categorie = "";
    document.store.type_doc = {};
    
    $("#container-details").hide();
    
    reload_champs();
};

var change_type_store = function() {
    var li = $(this);
    var document = queue[$("#popup-store").attr("data-document")];
    
    // stocke le choix de l'utilisateur
    document.store.categorie = li.attr("data-categorie");
    document.store.type_doc = { pk: li.attr("data-type"), detail: "" };
    
    // Unbind les types
    $("#container-classification").find("li")
    .unbind()
    .css("cursor", "auto");
    
    // affiche le bouton pour oublier le type
    li
    .attr("data-selected", "1")
    .append(
        $("<div></div>")
        .addClass("boutons-store")
        .text("  X")
        .click(remove_type_store)
    );
    
    affiche_details();
};

var reload_champs = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var monde = document.store.monde;
    var cascade = profil.mondes[monde].cascade;
    var last_i = undefined;
    
    $("#container-champs").empty();
    $("#container-classification").empty();
    
    //////////////////////////////////
    // Affichage des champs déjà renseignés et du champ à renseigner
    $.each(cascade, function (i, champ) {
        if (document.store.champs[champ] === undefined || document.store.champs[champ] === "") {
            var parent = 0;
            
            if (i != 0) {
                parent = document.store.champs[cascade[i - 1]];
            }
            
            $.ajax({
                url: "json/champ.php",
                type: "POST",
                data: {
                    monde: monde,
                    champ: champ,
                    parent: parent
                },
                statusCode: {
                    200: function(valeurs) {
                        var div = $("<div></div>")
                                .addClass("champ-store")
                                .attr("data-champ", champ)
                                ;
                                
                        var select = $("<select></select>")
                                    .change(change_champ_store)
                                    .attr("data-placeholder", "Elige un " + profil.mondes[monde].champs[champ].label) // LOCALISATION
                                    .append("<option></option>")
                                    ;
                        
                        $.each(valeurs, function(j, valeur) {
                            select.append(
                                $("<option></option>")
                                .attr("value", j)
                                .text(valeur)
                            );
                        });
                        
                        $("#container-champs")
                        .append(
                            div.append(select)
                        );
                        
                        $("#container-champs")
                        .find("select")
                        .chosen({
                            no_results_text:'Nuevo ' + profil.mondes[monde].champs[champ].label // LOCALISATION
                        });

                    },
                    403: function() {
                        window.location.replace("index.php");
                    },
                    500: function() {
                        popup('Error de recuperacion de los documentos. Gracias por intentar otra vez', 'error'); // LOCALISATION
                    }
                }
            });  
            return false;          
        } else {
            var div = $("<div></div>")
                    .addClass("champ-store")
                    .attr("data-champ", champ)
                    ;
                    
            last_i = i;
            $("#container-champs").append(
                div.append(
                    $("<p></p>")
                    .text(profil.mondes[monde].champs[champ].label + " : " + profil.mondes[monde].champs[champ].liste[document.store.champs[champ]])
                    .append(
                        $("<div></div>")
                        .addClass("boutons-store")
                        .text("  X")
                        .click(remove_champ_store)
                    )
                )
            );
        } 
    });
    
    ////////////////////////////////////////////:
    // Affichage de l'arborescence des catégories et types
    var asterisk = "";
    
    if (last_i !== undefined) {
        // Types en racine
        $.each(profil.mondes[monde].champs[cascade[last_i]].types, function(j, type) {
            if (type.detail == 1) {
                asterisk = " *";
            }
            
            $("#container-classification").append(
                $("<li></li>")
                .attr("data-type", j)
                .attr("data-categorie", 0)
                .addClass("store-type")
                .text(type.label + asterisk)
                .click(change_type_store)
            );
        });
        
        // Catégories
        $.each(profil.mondes[monde].champs[cascade[last_i]].categories, function(j, categorie) {
            var ul = $("<ul></ul>");
            
            // Types
            $.each(categorie.types, function(k, type) {
                if (type.detail == 1) {
                    asterisk = " *";
                }
                ul.append(
                    $("<li></li>")
                    .attr("data-type", k)
                    .attr("data-categorie", j)
                    .addClass("store-type")
                    .text(type.label + asterisk)
                    .click(change_type_store)
                );
            });
            
            // On ajoute la catégorie à la liste
            $("#container-classification").append(
                $("<li></li>")
                .attr("data-categorie", j)
                .addClass("store-categorie")
                .text(categorie.label)
                .append(ul) // Ainsi que ses types                                
            );
        });
    }
};

var prev_document = function() {
    var document = $("#popup-store").attr("data-document");
    
    if (document == 0) {
        document = queue.length - 1;
    } else {
        document = document - 1;
    }
    
    change_document(document);
};

var next_document = function() {
    var document = $("#popup-store").attr("data-document");
    
    if (document == queue.length - 1) {
        document = 0;
    } else {
        document = parseInt(document) + 1;
    }
    
    change_document(document);
};

var change_document = function(document) {
    $('#files-list li[data-editing="1"]').addClass("done");
    $("#files-list li").attr("data-editing", "0");
    $('#files-list li[data-position="' + document + '"]')
    .removeClass("done")
    .attr("data-editing", 1);
    $("#popup-store").attr("data-document", document);
    
    queue[document].store.monde = $('#mondes-store li[data-selected="1"]').attr("data-monde");
    
    $("#container-details").hide();
    reload_champs();
};

var cancel_store = function() {
    // On cache le fond opaque et le store
    $("#opak").fadeOut();
    $("#popup-store").fadeOut();
    
    $('#files-list li[data-editing="1"]').addClass("done");
    $("#files-list li").attr("data-editing", "0");
    $("#popup-store").attr("data-document", "");
};

var archive_document = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var store = document.store;
    
    // On stocke la date et le détail
    store.date = $("#date-store").val();
    store.type_doc.detail = $("#detail-store").val();
    
    $.ajax({
        url: "do/doStore.php",
        type: "POST",
        data: {
            filename: document.filename,
            date: store.date,
            monde: store.monde,
            categorie: store.categorie,
            type: store.type_doc.pk,
            detail: store.type_doc.detail,
            champs: store.champs,
            maxchamp: store.last_champ
        },
        statusCode: {
            200: function() {
                popup('Su documento fue archivado con exito!', 'confirmation'); // LOCALISATION
                
                var new_position;
                
                // une fois terminé, on élimine de la queue
                // et on envoie le prochain document dans la queue
                var position = $("#popup-store").attr("data-document");
                
                // Si c'est le seul document de la queue on ferme le store
                if (queue.length == 1) {
                    cancel_store();
                } else {
                    if (position == queue.length - 1) {
                        new_position = queue.length - 2;
                    } else {
                        new_position = position;
                    }
                }
                
                queue.splice(position, 1);
                refresh_liste();
                
                change_document(new_position);
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de recuperacion de los documentos. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
};

var store_document = function() {
    var li = $(this).closest("li");
    
    $(this).closest("ul").find("li").attr("data-editing", "0");
    
    li.removeClass("done").attr("data-editing", "1");
    
    $("#popup-store").attr("data-document", li.attr("data-position"));
    
    // On binde les boutons du store
    $("#prev-store").unbind().click(prev_document);
    $("#next-store").unbind().click(next_document);
    
    // On nettoie le terrain
    $("#mondes-store").empty();
    
    // On pose le sélecteur de mondes  
    var select = $("<select></select>");
    $.each(profil.mondes, function(i, monde) {
        $("#mondes-store").append(
            $("<li></li>")
            .attr({
                "data-monde": i,
                "data-selected": 0
            })
            .append(
                $("<h1></h1>")
                .text(monde.label)
                .click(change_monde_store)
            )
        );
    });
    
    // On met par défaut le monde présent dans le Core
    $("#mondes-store li[data-monde=" + Core.monde + "]").find("h1").click();
        
    // On installe le viewer dans l'iframe
    
    // On affiche le fond opaque et le store
    $("#opak")
    .fadeIn()
    .unbind().click(cancel_store);
    $("#popup-store").fadeIn();
    
    // on déclenche le redimensionnement de la fenêtre
    $(window).trigger('resize');
};

// Au resize, on redimensionne l'iframe et le store
$( window ).resize(function() {
    $("#viewer-store").css("height", 0.97 * $("#popup-store").innerHeight() + $("#popup-store").offset().top - $("#viewer-store").offset().top + "px");
    $("#container-store").css("height", 0.97 * $("#popup-store").innerHeight() + $("#popup-store").offset().top - $("#viewer-store").offset().top + "px");
});
