
var Designer = Mentorial([{ ////////////////////// SCENARIO 999
    id: 0,
    titre: "Designer",
    description: "Es un muy bueno tutorial!",
    stages: [{////////////////////// 0
        id: 0,
        raises_flag: false,
        animations: [{
            type: "code",
            code: function() {
            
            }
        }],
        clean: function() {}
    }]
}]);

var Monde = {
    label: "",
    champs: [],
    
    _refresh: function() {
        var liste = $("#liste-map");
        var li = $("<li></li>").append(
            $("<span></span>")
            .attr("title", "Borrar")
            .addClass("tag-delete")
            .click(remove_tree)
        );
        var ul = $("<ul></ul>");
        var span = $("<span></span>").addClass("medailles");
        var img = $("<img/>");
        var current_ul = liste;
        
        var images = {
            time: img.clone()
                    .attr("src", "img/date_black_20.png")
                    .attr("title", "Documento mensuale"),
            niveau: {
                0: img.clone()
                    .attr("src", "img/niveau_0_20.png")
                    .attr("title", "Visible para todos usuarios"),
                10: img.clone()
                    .attr("src", "img/niveau_10_20.png")
                    .attr("title", "Visible a partir del nivel ARCHIVISTA"),
                20: img.clone()
                    .attr("src", "img/niveau_20_20.png")
                    .attr("title", "Visible a partir del nivel ADMINISTRATOR"),
                30: img.clone()
                    .attr("src", "img/niveau_30_20.png")
                    .attr("title", "Visible a partir del nivel GERENTE"),
            }
        };
        
        liste.empty();
        
        $.each(this.champs, function(i, champ) {
            var new_ul = ul.clone(true).addClass("designer-champ");
            
            current_ul.append(
                li.clone(true)
                .attr("data-id", i)
                .addClass("designer")
                .addClass("designer-champ")
                .append(
                    $("<img/>")
                    .attr("src", "img/add_20.png")
                    .attr("title", "Agregar un tipo de documento")
                    .addClass("profil-toggle-type")
                    .click(toggle_type)
                ).append(
                    $("<img/>")
                    .attr("src", "img/categorie_20.png")
                    .attr("title", "Agregar una categorie de documentos")
                    .addClass("profil-toggle-categorie")
                    .click(toggle_categorie)
                ).append(
                    $("<div></div>")
                    .attr("title", "Editar " + champ.label)
                    .text(champ.label)
                    .click(toggle_champ)
                )
            ).append(
                new_ul
                .addClass("designer-champ")
            );
            
            current_ul = new_ul;
            
            $.each(champ.types, function(j, type) {
                var new_span = span.clone();
                var label = type.label;
                
                if (type.detail) {
                    label += " ...";
                }
                
                if (type.time) {
                    new_span.append(images.time.clone());
                }
                
                new_span.append(images.niveau[type.niveau].clone());
                
                current_ul.append(
                    li.clone(true)
                    .attr("data-champ", i)
                    .attr("data-id", j)
                    .attr("title", "Editar " + type.label)
                    .addClass("designer")
                    .addClass("designer-type")
                    .append(label)
                    .append(new_span)
                    .click(toggle_type)
                );
            });
            
            $.each(champ.categories, function(j, categorie) {
                var ul_categorie = ul.clone(true).addClass("designer-categorie");
                var new_span = span.clone();
                
                if (categorie.time) {
                    new_span.append(images.time.clone());
                }
                
                new_span.append(images.niveau[categorie.niveau].clone());
                
                current_ul.append(
                    li.clone(true)
                    .attr("data-champ", i)
                    .attr("data-id", j)
                    .addClass("designer")
                    .addClass("designer-categorie")
                    .append(
                        $("<img/>")
                        .attr("src", "img/add_20.png")
                        .attr("title", "Agregar un tipo de documento")
                        .addClass("profil-toggle-type")
                        .click(toggle_type)
                    ).append(
                        $("<div></div>")
                        .attr("title", "Editar " + categorie.label)
                        .text(categorie.label)
                        .click(toggle_categorie)
                        .append(new_span)
                    )
                ).append(
                    ul_categorie
                    .addClass("designer-categorie")
                );
                
                $.each(categorie.types, function(k, type) {
                    var new_span = span.clone();
                    var label = type.label;
                    
                    if (type.detail) {
                        label += " ...";
                    }
                    
                    if (type.time) {
                        new_span.append(images.time.clone());
                    }
                    
                    new_span.append(images.niveau[type.niveau].clone());
                    
                    ul_categorie.append(
                        li.clone(true)
                        .attr("data-champ", i)
                        .attr("data-categorie", j)
                        .attr("data-id", k)
                        .attr("title", "Editar " + type.label)
                        .addClass("designer")
                        .addClass("designer-type")
                        .append(label)
                        .append(new_span)
                        .click(toggle_type)
                    );
                });
            });
        });
        
        if (this.champs.length == 0) {
            $("#bouton-new-champ").click();
        }
    }
};

var bootstrap_designer = function() {
    $("#liste").slideUp();   
    $(".admin").slideUp();
    $("#designer").fadeIn();
    
    $("#action-champ").show();
    
    $("#bouton-new-champ").unbind().click(toggle_champ);
    $("#bouton-save-champ").unbind().click(save_champ);
    $("#bouton-save-type").unbind().click(save_type);
    $("#bouton-save-categorie").unbind().click(save_categorie);
    $("#add-doc-to-champ").unbind().click(toggle_type);
    $("#add-doc-to-cat").unbind().click(toggle_type);
    $("#add-cat-to-champ").unbind().click(toggle_categorie);
    $("#add-cat-to-champ2").unbind().click(toggle_categorie);
    
    // ATTENTION
    // Si on unbinde après les chosen, on unbinde
    // TOUS les évènements Chosen! (updated, ...)
    $("#designer-type-niveau").unbind().change(toggle_save_type);
    $("#designer-categorie-niveau").unbind().change(toggle_save_categorie);
    
    $("#designer-type-niveau").chosen({
        width: $("#new-login").outerWidth(),
        disable_search_threshold: 10,
        inherit_select_classes: true/*,
        allow_single_deselect: true*/
    });
    
    $("#designer-categorie-niveau").chosen({
        width: $("#new-login").outerWidth(),
        disable_search_threshold: 10,
        inherit_select_classes: true/*,
        allow_single_deselect: true*/
    });
    
    Switch($("#detail-new-type"), {
        title: "detalle",
        OK_text: '<b>Se puede</b> agregar un detalle a este tipo de documento.<br/>',
        KO_text: '<b>No se puede</b> agregar un detalle a este tipo de documento.<br/>',
        tip: "Por ejemplo, contrato 'anual' o contrato 'de servicio'."
    });
    
    Switch($("#time-new-type"), {
        title: "Mensual",
        OK_text: 'Este tipo de documento <b>es mensual</b>',
        KO_text: 'Este tipo de documento <b>no es mensual</b>',
        tip: "Por ejemplo, las facturas pueden ser mensuales."
    });
    
    Monde._refresh();
};

var toggle_champ = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var ul;
    var champ;
    
    $(".action").hide();
    
    $("#action-champ").fadeIn();

    if (bouton.attr("id") == "bouton-new-champ") {
        if (Monde.champs.length == 0) {
            ul = $("#liste-map");
        } else {
            ul = $("ul.designer-champ").last();
        }
        $("#label-new-champ").val("");
        $("#action-champ").attr("data-id", "");
        $("#pluriel-new-champ").val("");
        $("#action-champ>h2").text("Nuevo campo"); // LOCALISATION
        $(".designer-ghost").remove();
        ul.append(
            $("<li></li>")
            .addClass("designer-champ")
            .addClass("designer-ghost")
            .text("Nuevo campo...")
        );
    } else {
        champ = Monde.champs[li.attr("data-id")];
        $("#action-champ").attr("data-id", li.attr("data-id"));
        $("#label-new-champ").val(champ.label);
        $("#pluriel-new-champ").val(champ.pluriel);
        $("#action-champ>h2").html("Campo <b>" + champ.label + "</b>"); // LOCALISATION
    }
};

var toggle_type = function() {
    var bouton = $(this);
    var label = $("#label-new-type");
    var detail = $("#detail-new-type");
    var time = $("#time-new-type");
    var niveau = $("#designer-type-niveau");
    var action = $("#action-type");
    var type, li, ul;
    
    $(".action").hide();
    
    if (bouton.hasClass("profil-toggle-type") || bouton.hasClass("option-help")) { // NOUVEAU DOCUMENT
        var champ, categorie;
        
        if (bouton.hasClass("profil-toggle-type")) {
            li = bouton.closest("li");
            
            if (li.hasClass("designer-champ")) { // NEW CHAMP
                champ = li.attr("data-id");
                categorie = "";
            } else { // NEW CATEGORIE
                champ = li.attr("data-champ");
                categorie = li.attr("data-id");
            }
        } else {
            if (bouton.attr("data-categorie") === undefined || bouton.attr("data-categorie") === "") {
                champ = bouton.attr("data-champ");
                categorie = "";
                
                li = $('#liste-map li.designer-champ[data-id="' + bouton.attr("data-champ") + '"]');
            } else {
                champ = bouton.attr("data-champ");
                categorie = bouton.attr("data-categorie");
                
                li = $('#liste-map li.designer-categorie[data-champ="' + bouton.attr("data-champ") + '"][data-id="' + bouton.attr("data-categorie") + '"]');
            }
        }
        
        ul = li.next("ul");
        
        action
        .fadeIn()
        .attr("data-champ", champ)
        .attr("data-categorie", categorie)
        .attr("data-id", "")
        ;
        
        $(".designer-ghost").remove();
        ul.prepend(
            $("<li></li>")
            .addClass("designer-type")
            .addClass("designer-ghost")
            .text("Nuevo documento...")
        );
        
        action.children("h2").html("Nuevo tipo de documento"); // LOCALISATION
        
        label.removeClass("KO").val("");
        niveau.removeClass("KO").val("").trigger("chosen:updated");
        detail.prop("checked", false).change();
    } else { // EDIT DOCUMENT
        li = bouton.closest("li");
        
        action
        .fadeIn()
        .attr("data-champ", li.attr("data-champ"))
        .attr("data-id", li.attr("data-id"))
        ;
        
        if (li.attr("data-categorie") === undefined || li.attr("data-categorie") === "") {
            action
            .attr("data-categorie", "");
            type = Monde.champs[li.attr("data-champ")].types[li.attr("data-id")];
        } else {
            action
            .attr("data-categorie", li.attr("data-categorie"));
            type = Monde.champs[li.attr("data-champ")].categories[li.attr("data-categorie")].types[li.attr("data-id")];
        }
        
        action.children("h2").html("Tipo de documento <b>" + type.label + "</b>"); // LOCALISATION
        
        label.val(type.label);
        detail.prop('checked', type.detail).change();
        niveau.val(type.niveau);
        niveau.trigger("chosen:updated");
    }    
};

var toggle_categorie = function() {
    var bouton = $(this);
    var label = $("#label-new-categorie");
    var niveau = $("#designer-categorie-niveau");
    var li;
        
    $(".action").hide();
    
    if (bouton.hasClass("profil-toggle-categorie") || bouton.hasClass("option-help")) { // NOUVELLE CATEGORIE
        var ul;
        
        if (bouton.hasClass("profil-toggle-categorie")) {
            li = bouton.closest("li");
        } else {
            li = $('#liste-map li.designer-champ[data-id="' + bouton.attr("data-champ") + '"]');
        }
        
        ul = li.next("ul");
        
        $("#action-categorie")
        .fadeIn()
        .attr("data-champ", li.attr("data-id"))
        .attr("data-id", "")
        ;
        
        $(".designer-ghost").remove();
        ul.prepend(
            $("<li></li>")
            .addClass("designer-categorie")
            .addClass("designer-ghost")
            .text("Nueva categoria...")  // LOCALISATION
        );
        
        $("#action-categorie>h2").html("Nueva categoria"); // LOCALISATION
        
        label.removeClass("KO").val("");
        niveau.removeClass("KO").val("").trigger("chosen:updated");
        
    } else { // EDIT CATEGORIE
        li = bouton.closest("li");
        $("#action-categorie")
        .fadeIn()
        .attr("data-champ", li.attr("data-champ"))
        .attr("data-id", li.attr("data-id"))
        ;
        categorie = Monde.champs[li.attr("data-champ")].categories[li.attr("data-id")];
        
        $("#action-categorie>h2").html("Categoria <b>" + categorie.label + "</b>"); // LOCALISATION
        
        label.val(categorie.label);
        niveau.val(categorie.niveau);
        niveau.trigger("chosen:updated");
    }
};

var save_champ = function() {
    var label = $("#label-new-champ");
    var pluriel = $("#pluriel-new-champ");
    var action = $("#action-champ");
    var champ, id;
    
    if (label.val() == "") {
        label.addClass("KO");
    } else {
        if (pluriel.val() == "") {
            pluriel.addClass("KO");
        } else {
            label.removeClass("KO");
            pluriel.removeClass("KO");
            
            champ = {
                label: label.val(),
                pluriel: pluriel.val()
            };
            
            if (action.attr("data-id") === undefined || action.attr("data-id") === "") {
                Monde.champs.push($.extend(champ, {
                    types: [],
                    categories: []
                }));
                id = Monde.champs.length - 1;
            } else {
                id = action.attr("data-id");
                Monde.champs[id] = $.extend(true, Monde.champs[id], champ);
            }
            
            label.val("");
            pluriel.val("");
            $("#action-champ").attr("data-id", "");
            $("#action-champ>h2").text("Nuevo campo");
            $(".option-help-champ").text(champ.label);
            $(".option-help").attr("data-champ", id);
            $(".option-help").attr("data-categorie", "");
            $("#action-champ").hide();
            $("#action-post-champ").show();
            $("#bouton-save-categorie").hide();
            Monde._refresh();
        }
    }
};

var save_type = function() {
    var label = $("#label-new-type");
    var detail = $("#detail-new-type");
    var time = $("#time-new-type");
    var niveau = $("#designer-type-niveau");
    var action = $("#action-type");
    var champ = Monde.champs[action.attr("data-champ")];
    var type, types, post;
    
    if (label.val() == "") {
        label.addClass("KO");
    } else {
        if (niveau.val() == "") {
            niveau.next("div").addClass("KO");
        } else {
            
            type = {
                label: label.val(),
                detail: detail.is(':checked'),
                time: time.is(':checked'),
                niveau: niveau.val()
            }
            
            if (action.attr("data-categorie") === undefined 
            || action.attr("data-categorie") === "") {
                types = champ.types;
                post = "champ";
                $(".option-help").attr("data-categorie", "");
            } else {
                types = champ.categories[action.attr("data-categorie")].types;
                post = "categorie";
            }
            
            if (action.attr("data-id") === undefined 
            || action.attr("data-id") === "") {
                types.push(type);
            } else {
                types[action.attr("data-id")] = $.extend(true, types[action.attr("data-id")], type);
            }
            
            label.removeClass("KO").val("");
            niveau.removeClass("KO").val("").trigger("chosen:updated");
            detail.prop("checked", false).change();
            time.prop("checked", false).change();
            
            $("#action-type").attr("data-id", "");
            $("#action-type>h2").text("Nuevo tipo de documento");
            $("#action-type").hide();
            $("#action-post-" + post).show();
            $("#bouton-save-type").hide();
            Monde._refresh();
        }
    }
};

var save_categorie = function() {
    var label = $("#label-new-categorie");
    var niveau = $("#designer-categorie-niveau");
    var action = $("#action-categorie");
    var champ = Monde.champs[action.attr("data-champ")];
    var categorie, id;
    
    if (label.val() == "") {
        label.addClass("KO");
    } else {
        if (niveau.val() == "") {
            niveau.next("div").addClass("KO");
        } else {
            
            categorie = {
                label: label.val(),
                niveau: niveau.val()
            }
            
            label.removeClass("KO").val("");
            niveau.removeClass("KO").val("").trigger("chosen:updated");
            
            if (action.attr("data-id") === undefined || action.attr("data-id") === "") {
                champ.categories.push($.extend(categorie, {
                    types: []
                }));
                id = champ.categories.length - 1;
            } else {
                id = action.attr("data-id");
                champ.categories[id] = $.extend(true, champ.categories[id], categorie);
            }
            
            $("#action-categorie").attr("data-id", "");
            $("#action-categorie>h2").text("Nueva categoria");
            $(".option-help-champ").text(champ.label);
            $(".option-help-categorie").text(categorie.label);
            $(".option-help").attr("data-champ", action.attr("data-champ"));
            $(".option-help").attr("data-categorie", id);
            $("#action-categorie").hide();
            $("#action-post-categorie").show();
            
            Monde._refresh();
        }
    }
};

var toggle_save_type = function() {
    if (!$("#bouton-save-type").is(":visible")) {
        $("#bouton-save-type").slideDown();
    }
};

var toggle_save_categorie = function() {
    if (!$("#bouton-save-categorie").is(":visible")) {
        $("#bouton-save-categorie").slideDown();
    }
};

var remove_tree = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var id = parseInt(li.attr("data-id"));
    var _element;
    var message, bouton, element;
    var champs = 0, types = 0, categories = 0;
    var go = false;
    
    var count_categories = function() {
    
    }
    
    if (li.hasClass("designer-champ")) {
        element = "este campo"; // LOCALISATION
        types = Monde.champs[id].types.length;
        categories = Monde.champs[id].categories.length;
        $.each(Monde.champs, function(i, champ) {
            if (i > id) {
                champs += 1;
                types += champ.types.length;
                categories += champ.categories.length;
                $.each(champ.categories, function(j, categorie) {
                    types += categorie.types.length;
                });
            }
        });
        _element = { type: "champ", id: id};
    } else {
        if (li.hasClass("designer-categorie")) {
            element = "esta categoria"; // LOCALISATION
            _element = { type: "categorie", id: id, champ: li.attr("data-champ")};
            types = Monde.champs[li.attr("data-champ")].categories[id].types.length;
        } else {
            element = "este tipo de documento";
            _element = { type: "type", id: id, champ: parseInt(li.attr("data-champ")), categorie: li.attr("data-categorie") };
        }
    }
    
    if (champs != 0 || types != 0 || categories != 0) {
        message = "Ojo! Si borras " + element + ", tambien se borraran :<ul>";
        
        if (champs != 0) {
            message += "<li><b>" + champs + "</b> campos</li>";
        }
        if (types != 0) {
            message += "<li><b>" + types + "</b> tipos de documentos</li>";
        }
        if (categories != 0) {
            message += "<li><b>" + categories + "</b> categorias</li>";
        }
        
        message += "</ul>";
        var callback = function() {
            _remove_tree(_element);
        };
        
        popup_confirmation(message, "Nueva revision de documento", "Confirmar (<i>Borrar todos</i>)", callback);
    } else {
        _remove_tree(_element);
    }
};

var _remove_tree = function(element) {
    switch(element.type) {
        case "champ":
            Monde.champs.splice(element.id);
            break;
        case "categorie":
            Monde.champs[element.champ].categories.splice(element.id, 1);
            break;
        case "type":
            if (element.categorie !== undefined && element.categorie !== "") {
                Monde.champs[element.champ].categories[element.categorie].types.splice(element.id, 1);
            } else {
                Monde.champs[element.champ].types.splice(element.id, 1);
            }
            break;
    };
    Monde._refresh();
};
