
var Store = {
    monde: "",
    champs: {},
    last_champ: ""
};

var change_monde_store = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var h1 = $(this);
    var ul = h1.closest("ul");
    var li = h1.closest("li");
    
    document.store.monde = li.attr("data-monde");
    document.store.champs = {};
    document.store.last_champ = "";
    document.store.categorie = "";
    document.store.type_doc = {};
    
    Store.monde = li.attr("data-monde");
    
    ul.find("li").attr("data-selected", "0");
    
    li.attr("data-selected", "1");
    
    $("#container-details").slideUp();
    
    if (Tuto.etape == 3) {
        Tuto.next();
    }
    
    reload_champs();
};

var remove_champ_store = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var monde = document.store.monde;
    var cascade = profil.mondes[monde].cascade;
    var div = $(this);
    var champ = $(this).closest(".champ-store").attr("data-champ");
    
    document.store.champs[champ] = "";
    document.store.categorie = "";
    document.store.type_doc = {};
    
    var post = 0;
    
    document.store.last_champ = "";
    
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
    
    $("#container-details").slideUp();
    
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
    $("#container-details").slideUp();
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
    
    $("#container-details").slideDown();
    
    if (type.detail == 1) {
        $("#input-detail").slideDown();      
        $("#detail-store").autocomplete({
            source: type.details
        });
    } else {
        $("#input-detail").slideUp()
            .find("input").val("");
    }
    
    $("#bouton-store").unbind().click(archive_document);
};

var remove_type_store = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    
    document.store.categorie = "";
    document.store.type_doc = {};
    
    $("#container-details").slideUp();
    
    reload_champs();
};

var change_type_store = function() {
    var li = $(this);
    var ul = $("#container-classification");
    var document = queue[$("#popup-store").attr("data-document")];
    
    ul.find("li").attr("data-selected", 0);
    
    // On referme les autres catégories
    ul.find('li[data-categorie][data-state="open"]').not('[data-categorie="' + li.attr("data-categorie") + '"]').click();
    
    // stocke le choix de l'utilisateur
    document.store.categorie = li.attr("data-categorie");
    document.store.type_doc = { pk: li.attr("data-type"), detail: "" };
    
    li.attr("data-selected", 1);
    
    affiche_details();
    
    if (Tuto.etape == 5) {
        Store.categorie = li.attr("data-categorie");
        Store.type_doc = document.store.type_doc;
        Tuto.next();
    }
};

var add_value = function(term) {
    var document = queue[$("#popup-store").attr("data-document")];
    var store = document.store;
    var chosen = this;
    var select = $("#container-champs select");
    var champ = select.closest("div").attr("data-champ");
    var parent;
    
    if (store.last_champ !== "") {
        parent = store.champs[store.last_champ];
    } else {
        parent = 0;
    }
    
    
    $.ajax({
        url: "do/doAddValue.php",
        type: "POST",
        data: {
            monde: store.monde,
            champ: champ,
            valeur: term,
            parent: parent
        },
        statusCode: {
            200: function(retour) {
                // On sauvegarde la nouvelle valeur dans le profil
                profil.mondes[store.monde].champs[champ].liste[retour.pk] = term;
                
                if (profil.mondes[store.monde].references[parent] !== undefined) {
                    if (profil.mondes[store.monde].references[parent].length == 0) {
                        profil.mondes[store.monde].references[parent] = {};
                    }
                } else {
                    profil.mondes[store.monde].references[parent] = {};
                }
                
                profil.mondes[store.monde].references[parent][retour.pk] = [];
                
                document.store.champs[champ] = retour.pk;
                document.store.last_champ = champ;
                
                $("#container-details").hide();
                reload_champs();
                
                if (Tuto.etape == 4) {
                    Store.champs[champ] = retour.pk;
                    Tuto.next();
                }
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de guarda. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
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
            
            var div = $("<div></div>")
                .addClass("champ-store")
                .attr("data-champ", champ)
            ;
            
            var select = $("<select></select>")
                .addClass("select-champ")
                .change(change_champ_store)
                .attr("data-placeholder", profil.mondes[monde].champs[champ].label) // LOCALISATION
                .append("<option></option>")
            ;
            
            if (profil.mondes[monde].references[parent] !== undefined) {
                $.each(profil.mondes[monde].references[parent], function(j, valeur) {
                    select.append(
                        $("<option></option>")
                        .attr("value", j)
                        .text(profil.mondes[monde].champs[cascade[i]].liste[j])
                    );
                });
            }
            
            $("#container-champs").append(div.append(select));
            
            $("#container-champs")
            .find("select")
            .chosen({
                no_results_text:'Empeza a teclar para agregar un ' + profil.mondes[monde].champs[champ].label,
                create_option_text:'Agregar ' + profil.mondes[monde].champs[champ].label + " ", // LOCALISATION
                create_option: add_value,
                inherit_select_classes: true,
                skip_no_results: true
            });
            
            
            $("#container-champs")
            .find("select")
            .next("div")
            .find("input")
            .keyup(function(event) {
                if (event.which == 13) {
                    $("#container-champs").find("select").next("div").find("li.create-option").click();
                }
                
                console.log(event.which);
            })
            
            
            return false;    // On quitte la boucle pour ignorer les champs suivants      
        } else {
            var div = $("<div></div>")
                    .addClass("champ-store")
                    .attr("data-champ", champ)
                    ;
                    
            last_i = i;
            $("#container-champs").append(
                div.append(
                    $("<div></div>")
                    .addClass("tag-champ")
                    .text(profil.mondes[monde].champs[champ].label + " : " + profil.mondes[monde].champs[champ].liste[document.store.champs[champ]])
                    .click(remove_champ_store)
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
                .attr({
                    "data-categorie": j,
                    "data-state": "closed"
                })
                .addClass("store-categorie")
                .text(categorie.label)
                .click(toggle_categorie)      
            ).append(ul); // Ainsi que ses types  
        });
    }
};

var toggle_categorie = function() {
    var li = $(this);
    
    if (li.attr("data-state") == "closed") {
        li.next("ul").slideDown();
        li.attr("data-state", "open");
    } else {
        li.next("ul").slideUp();
        li.attr("data-state", "closed");
    }
}

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
    
    $("#viewer-store").attr({
        "data-document": queue[document].li.attr("data-position"),
        src: "modules/viewer.php?document=" + queue[document].filename
    });
       
    // On met le nom du fichier
    $("#nom-doc-store").text(queue[document].displayname);
    
    $('#files-list li[data-editing="1"]').addClass("done");
    $("#files-list li").attr("data-editing", "0");
    $('#files-list li[data-position="' + document + '"]')
    .removeClass("done")
    .attr("data-editing", 1);
    $("#popup-store").attr("data-document", document);
    
    if (queue[document].store.monde === "") {
        queue[document].store.monde = Store.monde;
    }
    
    $("#mondes-store li").attr("data-selected", "0");
    
    $('#mondes-store li[data-monde="' + queue[document].store.monde + '"').attr("data-selected", "1");
    
    if (queue[document].store.last_champ === "") { 
        queue[document].store.last_champ = Store.last_champ;
        queue[document].store.champs = Store.champs;
    }
    
    $("#container-details").slideUp();
    
    reload_champs();
};

var cancel_store = function() {
    // On cache le fond opaque et le store
    $("#opak").fadeOut();
    $("#popup-store").fadeOut();
    
    $('#files-list li[data-editing="1"]').addClass("done");
    $("#files-list li").attr("data-editing", "0");
    $("#popup-store").attr("data-document", "");
    
    charge_dates();
};

var archive_document = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var store = document.store;
    
    // On stocke la date et le détail
    store.date = $("#date-store").val();
    store.type_doc.detail = $("#detail-store").val();
    $("#detail-store").val("");
    
    
    $.ajax({
        url: "do/doCheckRevision.php",
        type: "POST",
        data: {
            filename: document.filename,
            monde: store.monde,
            categorie: store.categorie,
            type: store.type_doc.pk,
            detail: store.type_doc.detail,
            champs: store.champs,
            maxchamp: store.last_champ
        },
        statusCode: {
            200: function() {
                var champ = profil.mondes[store.monde].champs[store.last_champ];
                var type;
                
                if (store.categorie == 0 || store.categorie == "") {
                    type = champ.types[store.type_doc.pk];
                } else {
                    type = champ.categories[store.categorie].types[store.type_doc.pk];
                }
                
                message = "Ya existe un <b>" + type.label + " " + store.type_doc.detail + "</b> por el <b>" + champ.label + " <u>" + champ.liste[store.champs[store.last_champ]] + "</u></b>. Si picas <i>Confirmar</i>, se creara una nueva <b>revision</b> de este documento.";
                
                var callback = function() {
                    _archive_document(document, store);
                };
                
                popup_confirmation(message, "Nueva revision de documento", "Confirmar (<i>crear una nueva revision</i>)", callback);
            },
            204: function() {
                _archive_document(document, store);
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error! Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
};

var _archive_document = function(document, store) {

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
                
                Store.monde = store.monde;
                Store.champs = store.champs;
                Store.last_champ = store.last_champ;
                
                var new_position;
                
                // une fois terminé, on élimine de la queue
                // et on envoie le prochain document dans la queue
                var position = $("#popup-store").attr("data-document");
                
                // Si c'est le seul document de la queue on ferme le store
                if (queue.length == 1) {
                    queue.length = 0;
                    refresh_liste();
                    cancel_store();
                } else {
                    if (position == queue.length - 1) {
                        new_position = queue.length - 2;
                    } else {
                        new_position = position;
                    }
                    
                    queue.splice(position, 1);
                    refresh_liste();
                    $('#mondes-top li[data-selected="1"]').click();
                    
                    if ($("#popup-store").is(":visible")) {
                        change_document(new_position);
                    } else {
                        $("#container-details").detach().appendTo($("#container-store")).hide();
                        dialogue.close();
                    }
                }
                
                if (Tuto.etape == 6) {
                    Tuto.next();
                }
                
                
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error! Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
}

var _store_document = function(position) {
    var li = queue[position].li;
    var ul = li.closest("ul");

    if (Tuto.etape == 2) {
        Tuto.next();
    }

    ul.find("li").attr("data-editing", "0");
    li.removeClass("done").attr("data-editing", "1");
    
    $("#popup-store").attr("data-document", position);
    
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
            .text(monde.label)
            .click(change_monde_store)
        );
    });
    
    // On met par défaut le monde présent dans le Core
    // (si le store est vide)
    if (queue[position].store.monde === "") {
        queue[position].store.monde = Core.monde;
    }
    
    $('#mondes-store li[data-monde="' + queue[position].store.monde + '"]').attr("data-selected", "1");
    Store.monde = Core.monde;  
          
    // On installe le viewer dans l'iframe
    
    $("#viewer-store").attr({
        "data-document": li.attr("data-position"),
        src: "modules/viewer.php?document=" + queue[li.attr("data-position")].filename
    });
    
    // On met le nom du fichier
    $("#nom-doc-store").text(queue[li.attr("data-position")].displayname);
    
    // On affiche le fond opaque et le store
    $("#opak")
    .fadeIn()
    .unbind().click(cancel_store);
    $("#popup-store").fadeIn();
    
    // on déclenche le redimensionnement de la fenêtre
    $(window).trigger('resize');
    
    reload_champs();
};

var store_document = function() {
    var li = $(this).closest("li");
    _store_document(li.attr("data-position"));
};
