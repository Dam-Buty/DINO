
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
            .addClass("tag-delete")
            .click(remove_tree)
        );
        var ul = $("<ul></ul>");
        var current_ul = liste;
        
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
                    .attr("src", "img/document_20.png")
                    .addClass("profil-toggle-type")
                    .click(toggle_type)
                ).append(
                    $("<img/>")
                    .attr("src", "img/categorie_20.png")
                    .addClass("profil-toggle-categorie")
                    .click(toggle_categorie)
                ).append(
                    $("<div></div>")
                    .text(champ.label)
                    .click(toggle_champ)
                )
            ).append(
                new_ul
                .addClass("designer-champ")
            );
            
            current_ul = new_ul;
            
            $.each(champ.types, function(j, type) {
                current_ul.append(
                    li.clone(true)
                    .attr("data-champ", i)
                    .attr("data-id", j)
                    .addClass("designer")
                    .addClass("designer-type")
                    .append(type.label)
                    .click(toggle_type)
                );
            });
            
            $.each(champ.categories, function(j, categorie) {
                var ul_categorie = ul.clone(true).addClass("designer-categorie");
                current_ul.append(
                    li.clone(true)
                    .attr("data-champ", i)
                    .attr("data-id", j)
                    .addClass("designer")
                    .addClass("designer-categorie")
                    .append(
                        $("<img/>")
                        .attr("src", "img/document_20.png")
                        .addClass("profil-toggle-type")
                        .click(toggle_type)
                    ).append(
                        $("<div></div>")
                        .text(categorie.label)
                        .click(toggle_categorie)
                    )
                ).append(
                    ul_categorie
                    .addClass("designer-categorie")
                );
                
                $.each(categorie.types, function(k, type) {
                    ul_categorie.append(
                        li.clone(true)
                        .attr("data-champ", i)
                        .attr("data-categorie", j)
                        .attr("data-id", k)
                        .addClass("designer")
                        .addClass("designer-type")
                        .append(type.label)
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
    
    Monde._refresh();
};

var toggle_champ = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var ul;
    var champ;
    
    $(".action").hide();
    
    $("#action-champ").fadeIn();

    if (bouton.attr("id") != "bouton-new-champ") {
        champ = Monde.champs[li.attr("data-id")];
        $("#action-champ").attr("data-id", li.attr("data-id"));
        $("#label-new-champ").val(champ.label);
        $("#pluriel-new-champ").val(champ.pluriel);
        $("#action-champ h1").html("Campo <b>" + champ.label + "</b>"); // LOCALISATION
    } else {
        if (Monde.champs.length == 0) {
            ul = $("#liste-map");
        } else {
            ul = $("ul.designer-champ").last();
        }
        $("#label-new-champ").val("");
        $("#action-champ").attr("data-id", "");
        $("#pluriel-new-champ").val("");
        $("#action-champ h1").text("Nuevo campo"); // LOCALISATION
        $(".designer-ghost").remove();
        ul.append(
            $("<li></li>")
            .addClass("designer-champ")
            .addClass("designer-ghost")
            .text("Nuevo campo...")
        );
    }
};

var toggle_type = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var ul = li.next("ul");
    var label = $("#label-new-type");
    var detail = $("#detail-new-type");
    var time = $("#time-new-type");
    var niveau = $("#designer-type-niveau");
    var action = $("#action-type");
    var type;
    
    $(".action").hide();
    
    if (li.hasClass("designer-champ")) {
        action
        .fadeIn()
        .attr("data-champ", li.attr("data-id"))
        .attr("data-categorie", "")
        .attr("data-id", "")
        ;
        
        $(".designer-ghost").remove();
        ul.prepend(
            $("<li></li>")
            .addClass("designer-type")
            .addClass("designer-ghost")
            .text("Nuevo documento...")
        );
        
        action.find("h1").html("Nuevo tipo de documento"); // LOCALISATION
        
        label.removeClass("KO").val("");
        niveau.removeClass("KO").val("").trigger("chosen:updated");
        detail.prop("checked", false);
        time.prop("checked", false);
    } else {
        if (li.hasClass("designer-categorie")) {
            action
            .fadeIn()
            .attr("data-champ", li.attr("data-champ"))
            .attr("data-categorie", li.attr("data-id"))
            .attr("data-id", "")
            ;
        
            $(".designer-ghost").remove();
            ul.append(
                $("<li></li>")
                .addClass("designer-type")
                .addClass("designer-ghost")
                .text("Nuevo documento...")
            );
            
            action.find("h1").html("Nuevo tipo de documento"); // LOCALISATION
            
            label.removeClass("KO").val("");
            niveau.removeClass("KO").val("").trigger("chosen:updated");
            detail.prop("checked", false);
            time.prop("checked", false);
        } else {
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
            
            action.find("h1").html("Tipo de documento <b>" + type.label + "</b>"); // LOCALISATION
            
            label.val(type.label);
            detail.prop('checked', type.detail);
            time.prop('checked', type.time);
            niveau.val(type.niveau);
            niveau.trigger("chosen:updated");
        }
    }    
};

var toggle_categorie = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var ul = li.next("ul");
    var label = $("#label-new-categorie");
    var time = $("#time-new-categorie");
    var niveau = $("#designer-categorie-niveau");
    var categorie;
    
    $(".action").hide();
    
    if (bouton.hasClass("profil-toggle-categorie")) {
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
        
        label.removeClass("KO").val("");
        niveau.removeClass("KO").val("").trigger("chosen:updated");
        time.prop("checked", false);
        
    } else {
        $("#action-categorie")
        .fadeIn()
        .attr("data-champ", li.attr("data-champ"))
        .attr("data-id", li.attr("data-id"))
        ;
        categorie = Monde.champs[li.attr("data-champ")].categories[li.attr("data-id")];
        
        label.val(categorie.label);
        time.prop('checked', categorie.time);
        niveau.val(categorie.niveau);
        niveau.trigger("chosen:updated");
    }
};

var save_champ = function() {
    var label = $("#label-new-champ");
    var pluriel = $("#pluriel-new-champ");
    var action = $("#action-champ");
    var champ;
    
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
            } else {
                Monde.champs[action.attr("data-id")] = $.extend(true, Monde.champs[action.attr("data-id")], champ);
            }
            
            label.val("");
            pluriel.val("");
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
    var type, types;
    
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
            
            label.removeClass("KO").val("");
            niveau.removeClass("KO").val("").trigger("chosen:updated");
            detail.prop("checked", false);
            time.prop("checked", false);
            
            if (action.attr("data-categorie") === undefined 
            || action.attr("data-categorie") === "") {
                types = champ.types;
            } else {
                types = champ.categories[action.attr("data-categorie")].types;
            }
            
            if (action.attr("data-id") === undefined 
            || action.attr("data-id") === "") {
                types.push(type);
            } else {
                types[action.attr("data-id")] = $.extend(true, types[action.attr("data-id")], type);
            }
            
            Monde._refresh();
        }
    }
};

var save_categorie = function() {
    var label = $("#label-new-categorie");
    var time = $("#time-new-categorie");
    var niveau = $("#designer-categorie-niveau");
    var action = $("#action-categorie");
    var champ = Monde.champs[action.attr("data-champ")];
    var categorie;
    
    if (label.val() == "") {
        label.addClass("KO");
    } else {
        if (niveau.val() == "") {
            niveau.next("div").addClass("KO");
        } else {
            
            categorie = {
                label: label.val(),
                time: time.is(':checked'),
                niveau: niveau.val()
            }
            
            label.removeClass("KO").val("");
            niveau.removeClass("KO").val("").trigger("chosen:updated");
            time.prop("checked", false);
            
            if (action.attr("data-id") === undefined || action.attr("data-id") === "") {
                champ.categories.push($.extend(categorie, {
                    types: []
                }));
            } else {
                champ.categories[action.attr("data-id")] = $.extend(true, champ.categories[action.attr("data-id")], categorie);
            }
            
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
