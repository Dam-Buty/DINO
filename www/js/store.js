
var Store = {
    suggestions: {
        monde: "",
        champs: {},
        last_champ: ""
    },
    
    document: undefined,
    position: 0,
    cluster: "",
    queue: [],
    
    opak: undefined,
    popup: undefined,
    mondes: {
        ul: undefined,
        lis: {},
        first: function() {
            return this.ul.find("li:first()");
        }
    },
    prev_button: undefined,
    next_button: undefined,
    details: undefined,
    bouton: undefined,
    viewer: undefined,
    
    show: function(cluster, position) {
        if (this.opak === undefined) {
            this.opak = $("#opak");
        }
        if (this.popup === undefined) {
            this.popup = $("#popup-store");
        }
        if (this.mondes.ul === undefined) {
            this.mondes.ul = $("#mondes-store");
        }
        if (this.prev_button === undefined) {
            this.prev_button = $("#prev-store");
        }
        if (this.next_button === undefined) {
            this.next_button = $("#next-store");
        }
        if (this.details === undefined) {
            this.details = $("#container-details");
        }
        if (this.bouton === undefined) {
            this.bouton = $("#bouton-store");
        }
        if (this.viewer === undefined) {
            this.viewer = $("#viewer-store");
        }
        if (this.nom_doc === undefined) {
            this.nom_doc = $("#nom-doc-store");
        }
        
        this.position = position;
        this.cluster = cluster;
        this.document = Queue.clusters[cluster].documents[position];
        
        var li = this.document.li;
        var ul = li.closest("ul");
        
        var self = this;
        
        // On binde les boutons du store
        this.prev_button.unbind().click(function() {
            self.prev();
        });
        
        this.next_button.unbind().click(function() {
            self.next();
        });
        
        // On nettoie le terrain
        this.mondes.ul.empty();
        
        // On pose le sélecteur de mondes  
        $.each(profil.mondes, function(i, monde) {
            var li_monde = $("<li></li>")
                            .attr({
                                "data-monde": i,
                                "data-selected": 0
                            })
                            .text(monde.label)
                            .click(self.change_monde);
            
            self.mondes.lis[i] = li_monde;
            
            self.mondes.ul.append(li_monde);
        });
        
        // On met par défaut le premier monde
        if (this.document.store.monde === "") {
            this.document.store.monde = this.mondes.first().attr("data-monde");
        }
        
        this.mondes.lis[this.document.store.monde].attr("data-selected", "1");
        this.monde = Core.monde;  
        
        // on cache les champs détails
        this.details.hide();
        this.bouton.fadeOut();
              
        // On affiche le document
        this.view();
        
        // on déclenche le redimensionnement de la fenêtre
//        $(window).trigger('resize');
        Tuto.flag(2);
        
        reload_champs();
    },
    
    hide: function() {
        this.opak.fadeOut();
        this.popup.fadeOut();
        
        this.current = 0;
        this.cluster = "";
    },
    
    view: function() {
        var self= this;
        
        this.viewer.attr({
            "data-position": this.document.position,
            "data-cluster": this.document.type,
            src: "modules/viewer.php?document=" + this.document.filename + "&display=" + encodeURIComponent(this.document.displayname)
        });
        
        // On met le nom du fichier
        this.nom_doc.text(this.document.displayname);
        
        // On affiche le fond opaque et le store
        this.opak
        .fadeIn()
        .unbind().click(function() {
            self.hide();
        }); 
        this.popup.fadeIn();
    }
};

var change_monde_store = function() {
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    var document = Queue.clusters[cluster].documents[position];
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
    $("#bouton-store").fadeOut();
    
    Tuto.flag(3);
    
    reload_champs();
};

var remove_champ_store = function() {
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    var document = Queue.clusters[cluster].documents[position];
    var monde = document.store.monde;
    var cascade = profil.mondes[monde].cascade;
    var li = $(this);
    var champ = li.attr("data-champ");
    
    document.store.champs[champ] = "";
    document.store.categorie = "";
    document.store.type_doc = {};
    
    var post = 0;
    
    document.store.last_champ = "";
    Store.last_champ = "";
    
    $.each(cascade, function(i, champ_cascade) {
        if (post) {
            document.store.champs[champ_cascade] = "";
            Store.champs[champ_cascade] = "";
        } else {
            if (champ_cascade == champ) {
                post = 1;
            } else {
                document.store.last_champ = champ_cascade;
                Store.last_champ = champ_cascade;
            }
        }
    });
    
    $("#container-details").slideUp();
    $("#bouton-store").fadeOut();
    
    reload_champs();
};

var change_champ_store = function() {
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    var document = Queue.clusters[cluster].documents[position];
    var select = $(this);
    var champ = select.attr("data-champ");
    var champ_profil = profil.mondes[document.store.monde].champs[champ];
    var valeur = select.val();
    
    // on stocke dans le store
    if (valeur != 0) {
        document.store.champs[champ] = valeur;
        document.store.last_champ = champ;
        Store.last_champ = champ;
        Store.champs[champ] = valeur;
    }
    
    $("#container-details").slideUp();
    $("#bouton-store").fadeOut();
                
    Tuto.flag(4);
    
    reload_champs();
};

var affiche_details = function() {
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    var document = Queue.clusters[cluster].documents[position];
    var monde = document.store.monde;
    var detail = 0;
    var type;
    var time_categorie = 0;
    
    if (document.store.categorie == 0 || document.store.categorie == "") {
        type = profil.mondes[monde]
                .champs[document.store.last_champ]
                .types[document.store.type_doc.pk];
    } else {
        type = profil.mondes[monde]
            .champs[document.store.last_champ]
            .categories[document.store.categorie]
            .types[document.store.type_doc.pk];
        time_categorie = profil.mondes[monde]
            .champs[document.store.last_champ]
            .categories[document.store.categorie]
            .time;
    }
    
    if (type.time == 1 || time_categorie == 1) {
        $("#container-date").show();    
    } else {
        $("#container-date").hide();
    }
    
    if (type.detail == 1) {
        $("#container-detail").show();      
        $("#detail-store").autocomplete({
            source: type.details
        }).focus();
    } else {
        $("#container-detail").hide();      
        $("#detail-store").val("");
    }
    
    if (type.time == 1 || time_categorie == 1 || type.detail == 1) {
        $("#bouton-store").css("width", "200%");
    } else {
        $("#bouton-store").css("width", "100%");
    }
    
    $("#container-details").slideDown();
    $("#bouton-store").fadeIn();
};

var remove_type_store = function() {
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    var document = Queue.clusters[cluster].documents[position];
    
    document.store.categorie = "";
    document.store.type_doc = {};
    
    $("#container-details").slideUp();
    $("#bouton-store").fadeOut();
    
    reload_champs();
};

var change_type_store = function() {
    var li = $(this);
    var ul = $(".classif");
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    var document = Queue.clusters[cluster].documents[position];
    
    ul.find("li").attr("data-selected", 0);
    
    // On referme les autres catégories
    ul.find('li[data-categorie][data-state="open"]').not('[data-categorie="' + li.attr("data-categorie") + '"]').click();
    
    // stocke le choix de l'utilisateur
    document.store.categorie = li.attr("data-categorie");
    document.store.type_doc = { pk: li.attr("data-type"), detail: "" };
    
    li.attr("data-selected", 1);
    
    affiche_details();
    
    if (Tuto.stage == 5) {
        Store.categorie = li.attr("data-categorie");
        Store.type_doc = document.store.type_doc;
        Tuto.flag(5);
    }
};

var add_value = function(term) {
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    var document = Queue.clusters[cluster].documents[position];
    var store = document.store;
    var chosen = this;
    var select = $("#container-nouveau-champ select");
    var champ = select.attr("data-champ");
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
            200: function(pk) {
                // On sauvegarde la nouvelle valeur dans le profil
                profil.mondes[store.monde].champs[champ].liste[pk] = term;
                
                if (profil.mondes[store.monde].references[parent] !== undefined) {
                    if (profil.mondes[store.monde].references[parent].length == 0) {
                        profil.mondes[store.monde].references[parent] = {};
                    }
                } else {
                    profil.mondes[store.monde].references[parent] = {};
                }
                
                profil.mondes[store.monde].references[parent][pk] = [];
                
                document.store.champs[champ] = pk;
                document.store.last_champ = champ;
                Store.champs[champ] = pk;
                Store.last_champ = champ;
                
                $("#container-details").slideUp();
                $("#bouton-store").fadeOut();
                reload_champs();
                
                Tuto.flag(4);
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
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    var document = Queue.clusters[cluster].documents[position];
    var monde = document.store.monde;
    var cascade = profil.mondes[monde].cascade;
    var last_i = undefined;
    var champ;
    var parent;
    
    $("#list-champs").empty();
    $("#list-classification").empty();
    $("#list-time").empty();
    
    $.each(cascade, function(i, pk) {
        
        if (document.store.champs[pk] !== undefined && document.store.champs[pk] !== "") {
            //////////////////////////////////////////
            /// Création des tags            
            champ = profil.mondes[monde].champs[pk];
            var li_tag = $("<li></li>")
                .addClass("tag-champ")
                .attr("data-champ", pk)
                .html("<b>" + champ.label + "</b><br/>" + champ.liste[document.store.champs[pk]])
                .click(remove_champ_store)
                ;
            
            $("#list-champs").append(li_tag);
        } else {
            last_i = i;
            return false;
        }
    });
    
    if (last_i === undefined) {
        last_i = cascade.length;
    }
    
    var pk = cascade[last_i];
    var hasChild = (last_i <= cascade.length - 1);
    var asterisk = "";
    
    /////////////////////////////////////////
    // Création des types de documents
    if (last_i > 0) {
        champ_parent = cascade[last_i - 1];
        parent = document.store.champs[champ_parent];
        champ = profil.mondes[monde].champs[champ_parent];
                        
        var hasTypes = false;
        var hasTime = false;
        var li_classif;
        
        // Types en racine
        $.each(champ.types, function(j, type) {
            hasTypes = true;
            if (type.detail == 1) {
                asterisk = " *";
            } else {
                asterisk = "";
            }
            
            if (type.time == "0") {
                li_classif = $("#list-classification");
            } else {
                li_classif = $("#list-time");
                hasTime = true;
            }
            
            li_classif.append(
                $("<li></li>")
                .attr("data-type", j)
                .attr("data-categorie", 0)
                .addClass("store-type")
                .text(type.label + asterisk)
                .click(change_type_store)
            );
        });
        
        // Catégories
        $.each(champ.categories, function(j, categorie) {
            var ul = $("<ul></ul>");
            
            // Types
            $.each(categorie.types, function(k, type) {
                hasTypes = true;
                if (type.detail == 1) {
                    asterisk = " *";
                } else {
                    asterisk = "";
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
            
            if (categorie.time == "0") {
                li_classif = $("#list-classification");
            } else {
                li_classif = $("#list-time");
                hasTime = true;
            }
            
            // On ajoute la catégorie à la liste
            li_classif.append(
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
        
        if (hasTypes) {
            $("#entete-classification").html("Documentos <b>unicos</b> del <b>" + champ.label + "</b> : ");
            $("#container-classification").show();
        } else {
            $("#container-classification").hide();
        }
        
        if (hasTime) {
            $("#entete-time").html("Documentos <b>mensuales</b> del <b>" + champ.label + "</b> : ");
            $("#entete-time").show();
            $("#list-time").show();
        } else {
            $("#entete-time").hide();
            $("#list-time").hide();
        }      
        
        if (hasTypes && hasTime) {
            $("#entete-time").addClass("time");
        } else {
            $("#entete-time").removeClass("time");
        }
        
    } else {
        $("#container-classification").hide();
        parent = 0;
    }
    
    /////////////////////////////////////////
    // Création du champ à renseigner
    if (hasChild) {
        champ = profil.mondes[monde].champs[pk];
        
        var select = $("<select></select>")
            .addClass("select-champ")
            .change(change_champ_store)
            .attr("data-champ", pk)
            .attr("data-placeholder", "Selecciona un " + champ.label)
            .append("<option></option>")
        ;
        
        if (last_i % 2 == 1) {
            select.addClass("select-odd");
        }
        
        // On va trier les options
        var tri = [];
        
        var trie_options = function(a, b) {
            var a_ = a.label;
            var b_ = b.label;
            
            if (a_ < b_) {
                return -1;
            } else {
                if (a_ > b_) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };
                    
        if (profil.mondes[monde].references[parent] !== undefined) {
            $.each(profil.mondes[monde].references[parent], function(j, valeur) {
                tri.push({
                    pk: j,
                    label: profil.mondes[monde].champs[cascade[last_i]].liste[j]
                });
            });
            
            tri.sort(trie_options);
            
            $.each(tri, function(j, option) {
                select.append(
                    $("<option></option>")
                    .attr("value", option.pk)
                    .text(option.label)
                );
            });
        }
        
        $("#container-nouveau-champ").empty().show()
        .append(select);
        
        if (profil.niveau < 20 && !profil.mondes[monde].all && last_i == 0) {
            $("#container-nouveau-champ")
            .find("select")
            .attr("data-champ", pk)
            .chosen({
                inherit_select_classes: true
            });
        } else {
            $("#container-nouveau-champ")
            .find("select")
            .attr("data-champ", pk)
            .chosen({
                create_option_text:'Agregar ' + champ.label + " ", // LOCALISATION
                create_option: add_value,
                inherit_select_classes: true,
                skip_no_results: true
            });
            
            $("#container-nouveau-champ")
            .find("select")
            .on("chosen:showing_dropdown", function() {
                $("div.select-champ input").tooltipster({
                    content: 'Empeza a teclear para agregar un nuevo ' + champ.label,
                    position: "left",
                    timer: 1400
                }).tooltipster("show");
            });
                        
            $("#container-nouveau-champ")
            .find("select")
            .next("div")
            .find("input")
            .keyup(function(event) {
                if (event.which == 13) {
                    $("#container-nouveau-champ").find("select").next("div").find("li.create-option").click();
                }
            });
        }
    } else {
        $("#container-nouveau-champ").hide();
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
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    
    if (position == 0) {
        position = Queue.clusters[cluster].documents.length - 1;
    } else {
        position = parseInt(position) - 1;
    }
    
    change_document(position);
};

var next_document = function() {
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    
    if (position == Queue.clusters[cluster].documents.length - 1) {
        position = 0;
    } else {
        position = parseInt(position) + 1;
    }
    
    change_document(position);
};

var change_document = function(position) {
    var cluster = $("#popup-store").attr("data-cluster");
    var document = Queue.clusters[cluster].documents[position];
    
    $("#viewer-store").attr({
        "data-position": position,
        "data-cluster": cluster,
        src: "modules/viewer.php?document=" + document.filename + "&display=" + encodeURIComponent(document.displayname)
    });
       
    // On met le nom du fichier
    $("#nom-doc-store").text(document.displayname);
    
    $('#files-list li[data-editing="1"]').addClass("done");
    $("#files-list li").attr("data-editing", "0");
    $('#files-list li[data-position="' + document + '"]')
    .removeClass("done")
    .attr("data-editing", 1);
    $("#popup-store").attr("data-position", position);
    $("#popup-store").attr("data-cluster", cluster);
    
    if (document.store.monde === "") {
        document.store.monde = Store.monde;
    }
    
    $("#mondes-store li").attr("data-selected", "0");
    
    $('#mondes-store li[data-monde="' + document.store.monde + '"]').attr("data-selected", "1");
    
    if (document.store.last_champ === "") { 
        document.store.last_champ = Store.last_champ;
        document.store.champs = Store.champs;
    }
    
    $("#container-details").slideUp();
    $("#bouton-store").fadeOut();
    $("#detail-store").val("");
    
    $('li.store-type[data-selected="1"]').attr("data-selected", 0);
    // reload_champs();
};

var archive_document = function() {
    var cluster = $("#popup-store").attr("data-cluster");
    var position = $("#popup-store").attr("data-position");
    var document = Queue.clusters[cluster].documents[position];
    var store = document.store;
    var monde = profil.mondes[store.monde];
    var champ = monde.champs[store.last_champ];
    var type;
    var time = "000000";
    
    // On stocke la date et le détail
    store.date = $("#date-store").val();
    
    store.type_doc.detail = $("#detail-store").val();
    $("#detail-store").val("");
    
    // on ajoute le détail au profil s'il n'y est pas encore
    if (store.categorie == 0 || store.categorie == "") {
        type = champ.types[store.type_doc.pk];
    } else {
        type = champ.categories[store.categorie].types[store.type_doc.pk];
    }
    
    if (type.details.indexOf(store.type_doc.detail) == -1) {
        type.details.push(store.type_doc.detail);
    }
    // 0123456789
    //"10/04/2013"
    
    if (type.time == 1) {
        time = store.date.substring(6, 10) + store.date.substring(3, 5);  
    }
    
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
            time: time,
            maxchamp: store.last_champ
        },
        statusCode: {
            200: function() {                
                var label_doc = type.label + " " + store.type_doc.detail;
                
                if (type.time == 1) {
                    label_doc += "</b> de <b>" + mois[store.date.substring(3, 5)] + " " + store.date.substring(6, 10);
                }
                
                message = "Ya existe un <b>" + label_doc + "</b> por el <b>" + champ.label + " <u>" + champ.liste[store.champs[store.last_champ]] + "</u></b>.<br/>Si picas <i>Confirmar</i>, se creara una nueva <b>revision</b> de este documento.";
                
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
    var monde = profil.mondes[store.monde];
    var type, time;
    
    if (store.categorie == 0) {
        type = monde.champs[store.last_champ].types[store.type_doc.pk];
    } else {
        type = monde.champs[store.last_champ].categories[store.categorie].types[store.type_doc.pk];
    }
    
    if (type.time == 1) {
        time = store.date.substring(6, 10) + store.date.substring(3, 5);
    } else {
        time = "000000";
    }

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
            time: time,
            maxchamp: store.last_champ
        },
        statusCode: {
            200: function() {
                popup('Su documento fue archivado con exito!', 'confirmation'); // LOCALISATION
                
                Store.monde = store.monde;
                Store.champs = store.champs;
                Store.last_champ = store.last_champ;
                
                // une fois terminé, on élimine de la queue
                // et on envoie le prochain document dans la queue
                var position = $("#popup-store").attr("data-position");
                
                avance_store(position);
                
                Tuto.flag(6);       
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

var avance_store = function(position) {
    var cluster = $("#popup-store").attr("data-cluster");
    var new_position;
    
    // Si c'est le seul document de la queue on ferme le store
    if (Queue.clusters[cluster].documents.length == 1 || Tuto.stage == 6) {
        if (Queue.clusters[cluster].documents.length == 1) {
            Queue.clusters[cluster].documents.length = 0;
        }
        $('#mondes-top li[data-monde="' + Store.monde + '"]').click(); 
        
        if ($("#popup-store").is(":visible")) {
            cancel_store();
        } else {
            $("#container-details").detach().appendTo($("#container-store")).hide();
            dialogue.close();
        }
    } else {
        if (position == Queue.clusters[cluster].documents.length - 1) {
            new_position = Queue.clusters[cluster].documents.length - 2;
        } else {
            new_position = position;
        }
        
        Queue.clusters[cluster].remove_index(position);
        
        $('#mondes-top li[data-monde="' + Store.monde + '"]').click();
        
        if ($("#popup-store").is(":visible")) {
            change_document(new_position);
        } else {
            $("#container-details").detach().appendTo($("#container-store")).hide();
            dialogue.close();
        }
    }
};
