
var Store = {
    bootstrap: false,
    bootstrap_types: false,
    
    suggestions: {
        monde: "",
        champs: {},
        last_champ: ""
    },
    
    document: undefined,
    position: 0,
    cluster: "",
    
    mondes: {
        ul: undefined,
        lis: {},
        first: function() {
            return this.ul.find("li:first()");
        }
    },
    types: {
        liste: {},
        sorted: [],
        _sort: function() { 
            var self = this;
                    
            $.each(this.liste, function(i, type) {
                self.sorted.push(i);
            });
            
            self.sorted.sort();
        },
        add: function(options) {
            if (this.liste[options.label] === undefined) {
                this.liste[options.label] = {
                    mondes: {}
                }
            }
            
            var type = this.liste[options.label];
            
            if (type.mondes[options.monde] === undefined) {
                type.mondes[options.monde] = {
                    champs: {}
                };
            }
            
            var monde = type.mondes[options.monde];
            
            monde.champs[options.champ] = options.pk;
        },
        count_mondes: function(type) {
            var nb = 0;
            
            $.each(this.liste[type].mondes, function(i, monde) {
                nb++;
            });
            
            return nb;
        },
        first_monde: function(type) {
            var monde = 0;
            
            $.each(this.liste[type].mondes, function(i, monde) {
                monde = i;
                return false;
            });
            
            return monde;
        },
        count_champs: function(type, monde) {
            var nb = 0;
            
            $.each(this.liste[type].mondes[monde].champs, function(i, champ) {
                nb++;
            });
            
            return nb;
        },
        first_champ: function(type, monde) {
            var champ = 0;
            
            $.each(this.liste[type].mondes[monde].champs, function(i, champ) {
                champ = i;
                return false;
            });
            
            return champ;
        }
    },
    // jQuery cached selectors
    opak: undefined,
    popup: undefined,
    prev_button: undefined,
    next_button: undefined,
    bouton: undefined,
    viewer: undefined,
    nom_doc: undefined,
    etapes: undefined,
    tags: undefined,
    
    // jQuery cached selectors for different containers
    containers: {
        type: {
            div: undefined,
            ul: undefined,
            input: undefined,
            new_li: undefined,
            new_label: undefined,
            lis_selector: function() {
                return $("#list-type li:not(.store-new)");
            }
        },
        champ: {
            div: undefined,
            ul:undefined,
            lis_selector: function() {
                return $("#list-champ li:not(.store-new)");
            }
        },
        entite: {
            div: undefined,
            ul:undefined,
            input: undefined,
            new_li: undefined,
            lis_selector: function() {
                return $("#list-entite li:not(.store-new)");
            }
        }
    },
    
    // jQuery cached selectors for labels
    labels: {
        type: undefined,
        entite: undefined
    },
    
    show: function(cluster, position) {        
        this.position = position;
        this.cluster = cluster;
        this.document = Queue.clusters[cluster].documents[position];
        
        // On initialise le store au premier lancement
        if (!this.bootstrap) {
            this._init();
        }
              
        // On affiche le document
        this.view();
        
        this.ask();
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
    },
    
    _init: function() {
        // cache jQuery elements
        this.opak = $("#opak");
        this.popup = $("#popup-store");
        this.prev_button = $("#prev-store");
        this.next_button = $("#next-store");
        this.viewer = $("#viewer-store");
        this.nom_doc = $("#nom-doc-store");
        this.bouton = $("#bouton-store");
        this.tags = $("#list-champs");
        this.etapes = $(".store-etape");
        this.labels.type = $(".label-type");
        this.labels.entite = $(".label-entite");
        
        // cache jQuery elements for containers
        $.extend(this.containers.type, {
            div: $("#store-type"),
            ul: $("#list-type"),
            input: $("#search-type"),
            new_li: $("#new-type"),
            new_label: $(".new-type-label")
        });
        
        $.extend(this.containers.champ, {
            div: $("#store-champ"),
            ul: $("#list-champ")
        });
        
        $.extend(this.containers.entite, {
            div: $("#store-entite"),
            ul: $("#list-entite"),
            input: $("#search-entite"),
            new_li: $("#new-entite"),
            new_label: $(".new-entite-label")
        });
        
        var self = this;
        
        // Collecte d'informations dans le profil
        $.each(profil.mondes, function(i, monde) {
            $.each(monde.champs, function(j, champ) {
                $.each(champ.types, function(k, type) {
                    self.types.add({
                        pk: k,
                        label: type.label,
                        champ: j,
                        monde: i
                    });
                });
            });
        });
        
        this.types._sort();
        
        // Bind events
        this.opak.click(function() {
            self.hide();
        });
        
        this.prev_button.unbind().click(function() {
            self.prev();
        });
        
        this.next_button.unbind().click(function() {
            self.next();
        });
        
        this.bootstrap = true;
    },
    
    show_types: function() {
        if (!this.bootstrap_types) {
            var self = this;
            
            this.containers.type.new_li.hide();
            
            $.each(this.types.sorted, function(i, type) {
                var li = $("<li></li>")
                        .attr({
                            "data-type": type
                        })
                        .append(
                            $("<div></div>")
                            .text(type)
                        ).click(function() {
                            self.select_type(type);
                        });
                        
                self.containers.type.ul.append(li);
            });
            
            this.bootstrap_types = true;
        }
                 
        this.containers.type.div.slideDown();
        this.containers.type.input.unbind().keyup(function() {
            self.search_types();
        });
    },
    
    search_types: function() {
        var container = this.containers.type;
        var type = container.input.val();
        
        if (type != "") {
//            container.new_label.text(type)
//            container.new_li.show();
            
            $.each(container.lis_selector(), function(i, _li) {
                var li = $(_li);
                
                if (li.attr("data-type").toLowerCase().indexOf(type.toLowerCase()) == -1) {
                    li.hide();
                } else {
                    li.show();
                }
            });
        } else {
//            container.new_li.slideUp();
            container.lis_selector().show();
        }
    },
    
    select_type: function(label) {
        this.document.store.type.label = label;
        
        if (this.types.count_mondes(label) == 1) {
            var monde = this.types.first_monde(label);
            this.document.store.monde = monde;
            
            if (this.types.count_champs(label, monde) == 1) {
                this.load_champs(profil.mondes[monde].cascade, this.types.first_champ(label, monde));
            }
        }
        
        this.labels.type.text(label);
        this.tag_type(label);
        
        this.ask();
    },
    
    add_type: function(label) {
        
    },
    
    tag_type: function(label) {
        var self = this;
        
        var li_tag = $("<li></li>")
            .addClass("tag-champ")
            .html("<b>" + label + "</b>")
            .click(function() {
                self.remove_type();
            })
            ;
        
        this.tags.append(li_tag);
    },
    
    remove_type: function() {
        // On remet le store à zéro
        this.document.store = Document().store;
        this.tags.find("li").remove();
        this.ask();
    },
    
    show_champs: function() {
        var mondes = this.types.liste[this.document.store.type.label].mondes;
        var self = this;
        
        self.containers.champ.lis_selector().remove();
        
        $.each(mondes, function(i, monde) {
            $.each(monde.champs, function(j, pk_type) {
                var champ = profil.mondes[i].champs[j];
                var li = $("<li></li>")
                        .attr({
                            "data-monde": i
                        })
                        .append(
                            $("<div></div>")
                            .text('A un(a) "' + champ.label + '"')
                        ).click(function() {
                            self.select_champ(i, j, pk_type);
                        });
                
                self.containers.champ.ul.append(li);
            });
        });
        
        this.containers.champ.div.slideDown();
    },
    
    select_champ: function(_monde, _champ, _type) {
        var store = this.document.store;
        var monde = profil.mondes[_monde];
        var label = monde.champs[_champ].label;
        
        store.monde = _monde;
        store.type.pk = _type;
        store.type.object = monde.champs[_champ].types[_type];
        
        this.load_champs(monde.cascade, _champ);
        
        this.ask();
    },
    
    load_champs: function(cascade, limite) {
        var store = this.document.store;
        
        store.champs.cascade = cascade;
        
        $.each(cascade, function(i, champ) {
            store.champs[champ] = 0;
            if (champ == limite) {
                return false;
            }
        });
    },
    
    show_entites: function(_champ) {
        var store = this.document.store;
        var monde = profil.mondes[store.monde];
        var champ = monde.champs[_champ];
        var container = this.containers.entite;
        var self = this;
        var liste;
        var parent;
        
        if (store.last_champ === undefined) {
            parent = 0;
        } else {
            parent = store.champs[store.last_champ];
        }
        
        liste = monde.references[parent];
        
        container.lis_selector().remove();
        
        $.each(liste || [], function(pk, _) {
            var label = champ.liste[pk];
            
            var li = $("<li></li>")
                    .attr({
                        "data-pk": pk,
                        "data-label": label
                    })
                    .append(
                        $("<div></div>")
                        .text(label)
                    ).click(function() {
                        self.select_entite(_champ, pk);
                    });
                    
            container.ul.append(li);
        });
        
        this.labels.entite.text(champ.label);
        
        container.input.unbind().keyup(function(e) {
            self.search_entites(e.which);
        });
        
        container.new_li.unbind().click(function() {
            self.add_entite(self.document.store.monde, _champ, container.input.val());
        });
        
        container.div.slideDown();
    },
    
    search_entites: function() {
        var container = this.containers.entite;
        var entite = container.input.val();
        
        container.new_label.text('"' + entite + '"');
        
        if (entite != "") {
            
            $.each(container.lis_selector(), function(i, _li) {
                var li = $(_li);
                
                if (li.attr("data-label").toLowerCase().indexOf(entite.toLowerCase()) == -1) {
                    li.hide();
                } else {
                    li.show();
                }
            });
        } else {
            container.lis_selector().show();
        }
    },
    
    add_entite: function(monde, champ, label) {
        if (label != "") {
            var store = this.document.store;
            var parent = 0;
            var self = this;
            
            if (store.last_champ !== undefined) {
                parent = store.champs[store.last_champ];
            }
            
            $.ajax({
                url: "do/doAddValue.php",
                type: "POST",
                data: {
                    monde: monde,
                    champ: champ,
                    valeur: label,
                    parent: parent
                },
                statusCode: {
                    200: function(pk) {
                        _profil(function() {
                            self.select_entite(champ, pk);
                        });
                    },
                    403: function() {
                        window.location.replace("index.php");
                    },
                    500: function() {
                        popup("Error de creacion!", "error");
                        self.ask();
                    }
                }
            });
        } else {
            $("#search-entite").focus();
        }
    },
    
    select_entite: function(_champ, i) {
        this.document.store.champs[_champ] = i;
        this.document.store.last_champ = _champ;
        this.containers.entite.input.val("");
        this.tag_entite(_champ, i);
        
        this.ask();
    },
    
    tag_entite: function(champ, entite) {
        var monde = profil.mondes[this.document.store.monde];
        var _champ = monde.champs[champ];
        var self = this;
        
        var li_tag = $("<li></li>")
            .addClass("tag-champ")
            .attr("data-champ", champ)
            .html("<b>" + _champ.label + "</b><br/>" + _champ.liste[entite])
            .click(function() {
                self.remove_entite(champ)
            })
            ;
        
        this.tags.append(li_tag);
    },
    
    remove_entite: function(champ) {
        var store = this.document.store;
        var passed = false;
        var self = this;
        
        $.each(store.champs.cascade, function(i, _champ) {
            if ((_champ == champ) || passed) {
                store.champs[_champ] = 0;         
                self.tags.find('li[data-champ="' + _champ + '"]').remove();       
                passed = true;
            }
        });
        
        this.ask();
    },
    
    // Selon la position dans le scénario de classification,
    // On va proposer les bonnes options
    ask: function() {
        var store = this.document.store;
        var self = this;
        
        this.etapes.hide();
        
        if (store.type.label === undefined) {
            this.show_types();
        } else {
            if (store.monde === undefined) {
                this.show_champs();
            } else {
                var all_done = true;
                
                $.each(store.champs.cascade, function(i, champ) {
                    var entite = store.champs[champ];
                    
                    if (entite == 0) {
                        all_done = false;
                        self.show_entites(champ);
                        return false;
                    }
                });
                
                if (all_done) {
                    var type = store.type.object;
                    
                    if (type.detail == 1) {
                        this.show_details();
                    }
                    
                    if (type.date == 1) {
                        this.show_time();
                    }
                }
            }
        }
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
    
    Store.monde = document.store.monde;
    
    ul.find("li").attr("data-selected", "0");
    
    li.attr("data-selected", "1");
    
    $("#container-details").slideUp();
    $("#bouton-store").fadeOut();
    
    if (profil.stored == 0) {
        var monde = profil.mondes[Store.monde];
        
        if (monde.label != "Compras" && monde.label != "Ventas") {
            mixpanel.track("c-tuto-out", {});
            $("#container-tips-store").hide();
            $("#container-tips-alt").show();
            $("#tip-nofacture").slideDown();
        } else {
            mixpanel.track("c-monde", {
                monde: monde.label
            });
            $(".tip-champ-monde").text(monde.label);
            $(".tip-champ-entite").text(monde.champs[monde.cascade[0]].label);
            $(".tip-champ-event").text(monde.champs[monde.cascade[1]].label);
            
            $("#container-tips-alt").hide();
            $("#container-tips-store").show();
            $("#mondes-store li:first()").tooltipster().tooltipster("destroy");
            $(".tips-store").hide();
            $("#tip-entite").slideDown();
        }
    }
    
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
    
    if (profil.stored == 0 && !$("#container-tips-alt").is(":visible")) {
        var encours, prochain;
        encours = $(".tips-store");
        mixpanel.track("c-rem-champ", {
            champ: profil.mondes[monde].champs[champ].label
        });
        
        if ($("#tip-type").is(":visible")) {
            prochain = $("#tip-event");
        }
        
        if ($("#tip-event").is(":visible")) {
            prochain = $("#tip-entite");
        }
        
        if ($("#tip-entite").is(":visible")) {
            prochain = $("#tip-monde");
        }
        
        encours.hide();
        prochain.slideDown();
    }
    
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
    
    if (profil.stored == 0 && !$("#container-tips-alt").is(":visible")) {
        var monde = profil.mondes[Store.monde];
        var champ = monde.champs[Store.last_champ];
        
        if (Store.last_champ == monde.cascade[0]) {
            mixpanel.track("c-entite", {});
            $(".tips-store").hide();
            $(".tip-champ-entite-nom").text(champ.liste[Store.champs[monde.cascade[0]]]);
            
            $("#tip-event").slideDown();
        } else {
            mixpanel.track("c-event", {});
            $(".tips-store").hide();              
            $("#tip-type").slideDown();
        }
    }
                
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
            .attr("data-placeholder", "Selecciona o crea un " + champ.label)
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
    
    $('#files-list li[data-position="' + document + '"]')
    .removeClass("done");
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

var cancel_store = function() {
    // On cache le fond opaque et le store
    $("#opak").fadeOut();
    $("#popup-store").fadeOut();
    
    $("div.select-champ input").tooltipster().tooltipster("destroy");
    $("#mondes-store li:first()").tooltipster().tooltipster("destroy");
    
    $("#popup-store").attr("data-position", "");
    $("#popup-store").attr("data-cluster", "");
    
    // charge_dates();
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
                if (profil.stored == 0) {
                    mixpanel.track("c-end", {});
                    profil.stored = 1;
                    $.ajax({
                        url: "do/doFirstStore.php",
                        type: "POST"
                    });
                    
                    $("#container-tips-store").hide();
                    cancel_store();
                    
                    $('#mondes-top li[data-monde="' + Store.monde + '"]').click();
                    
                    setTimeout(function() {
                        $("#tip-watch").slideDown();
                    }, 800);
                }
                
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
