
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
        var li = $("<li></li>");
        var ul = $("<ul></ul>");
        var current_ul = liste;
        
        liste.empty();
        
        $.each(this.champs, function(i, champ) {
            var new_ul = ul.clone();
            
            current_ul.append(
                li.clone()
                .attr("data-id", i)
                .addClass("designer")
                .addClass("champ")
                .addClass("liste")
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
                .addClass("champ")
            );
            
            current_ul = new_ul;
            
            $.each(champ.categories, function(j, categorie) {
                var ul_categorie = ul.clone();
                current_ul.append(
                    li.clone()
                    .attr("data-champ", i)
                    .attr("data-id", j)
                    .addClass("designer")
                    .addClass("categorie")
                    .addClass("liste")
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
                    .addClass("categorie")
                );
                
                $.each(categorie.types, function(k, type) {
                    ul_categorie.append(
                        li.clone()
                        .attr("data-champ", i)
                        .attr("data-categorie", j)
                        .attr("data-id", k)
                        .addClass("designer")
                        .addClass("type")
                        .addClass("liste")
                        .text(type.label)
                        .click(toggle_type)
                    );
                });
            });
            
            $.each(champ.types, function(j, type) {
                current_ul.append(
                    li.clone()
                    .attr("data-champ", i)
                    .attr("data-id", j)
                    .addClass("designer")
                    .addClass("type")
                    .addClass("liste")
                    .text(type.label)
                    .click(toggle_type)
                );
            });
        });
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
    
    $("#designer-type-niveau").chosen({
        width: $("#new-login").outerWidth(),
        disable_search_threshold: 10,
        inherit_select_classes: true,
        allow_single_deselect: true
    });
    
    $("#designer-categorie-niveau").chosen({
        width: $("#new-login").outerWidth(),
        disable_search_threshold: 10,
        inherit_select_classes: true,
        allow_single_deselect: true
    });
    
    $("#designer-type-niveau").unbind().change(toggle_save_type);
    $("#designer-categorie-niveau").unbind().change(toggle_save_categorie);
};

var toggle_champ = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var champ;
    
    $(".action").fadeOut(function() {
        $("#action-champ").fadeIn();
    
        if (bouton.attr("id") != "bouton-new-champ") {
            champ = Monde.champs[li.attr("data-id")];
            $("#action-champ").attr("data-id", li.attr("data-id"));
            $("#label-new-champ").val(champ.label);
            $("#pluriel-new-champ").val(champ.pluriel);
            $("#action-champ h1").html("Campo <b>" + champ.label + "</b>"); // LOCALISATION
        } else {
            $("#label-new-champ").val("");
            $("#action-champ").attr("data-id", "");
            $("#pluriel-new-champ").val("");
            $("#action-champ h1").text("Nuevo campo"); // LOCALISATION
        }
    });
};

var toggle_type = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var label = $("#label-new-type");
    var detail = $("#detail-new-type");
    var time = $("#time-new-type");
    var niveau = $("#designer-type-niveau");
    var action = $("#action-type");
    var type;
    
    $(".action").fadeOut(function() {
        if (li.hasClass("champ")) {
            action
            .fadeIn()
            .attr("data-champ", li.attr("data-id"))
            .attr("data-categorie", "")
            .attr("data-id", "")
            ;
            
            action.find("h1").html("Nuevo tipo de documento"); // LOCALISATION
            
            label.removeClass("KO").val("");
            niveau.removeClass("KO").val("").trigger("chosen:updated");
            detail.prop("checked", false);
            time.prop("checked", false);
        } else {
            if (li.hasClass("categorie")) {
                action
                .fadeIn()
                .attr("data-champ", li.attr("data-champ"))
                .attr("data-categorie", li.attr("data-id"))
                .attr("data-id", "")
                ;
                
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
    });
};

var toggle_categorie = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var label = $("#label-new-categorie");
    var time = $("#time-new-categorie");
    var niveau = $("#designer-categorie-niveau");
    var categorie;
    
    $(".action").fadeOut(function() {
        if (bouton.hasClass("profil-toggle-categorie")) {
            $("#action-categorie")
            .fadeIn()
            .attr("data-champ", li.attr("data-id"))
            .attr("data-id", "")
            ;
            
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
        
    });
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
