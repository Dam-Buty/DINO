

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
    pk: undefined,
    label: "",
    champs: [],
    graveyard: [],
    templates: [],
    modif: false,
    
    saving: false,
    
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
                    .attr("title", "Documento mensual"),
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
        
        $("#nom-monde").val(this.label);
        
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
                    .click(designer_toggle_type)
                ).append(
                    $("<div></div>")
                    .attr("title", "Editar " + champ.label)
                    .text(champ.label)
                    .click(designer_toggle_champ)
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
                    .click(designer_toggle_type)
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
                        .click(designer_toggle_type)
                    ).append(
                        $("<div></div>")
                        .attr("title", "Editar " + categorie.label)
                        .text(categorie.label)
                        .click(designer_toggle_categorie)
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
                        .click(designer_toggle_type)
                    );
                });
            });
        });
        
        // On efface le bouton supprimer du premier champ
        $("#liste-map>li:first-child span.tag-delete").remove();
        
//        if (this.champs.length == 0) {
//            $(".designer-add-champ").click();
//        }
    },
    
    _save: function() {
        var documents = 0;
        var titre = "", message = "", bouton = "";
        var tuto_on_exit = false;
        
        this.saving = true;
        
        Tuto.flag(2, 0);
        
        if ($("#bouton-save-monde").hasClass("save-monde-OK")) {
            var ajax_save = function() {
                $.ajax({
                    url: "do/doSaveMonde.php",
                    type: "POST",
                    data: {
                        label: Monde.label,
                        pk: Monde.pk,
                        champs: Monde.champs,
                        graveyard: Monde.graveyard
                    },
                    statusCode: {
                        200: function() {
                            $("#bouton-save-monde").fadeOut();
                            if (Monde.pk === undefined) {
                                window.location.replace("index.php");
                            } else {
                                _profil(function() {});
                            }
                        },
                        403: function() {
                            window.location.replace("index.php");
                        },
                        500: function() {
                            popup("Erreur!", "error");
                        }
                    }
                });
            };
            
            if (Monde.label == "") {
                $("#nom-monde").focus().addClass("KO").tooltipster({
                    content: "Tu mundo debe tener un nombre!",
                    position: "bottom",
                    timer: 1400
                }).tooltipster("show");
            } else {
                $.each(Monde.graveyard, function(i, element) {
                    documents += element.bilan.documents || 0;
                });
                
                if (Monde.pk === undefined) {
                    titre = "Creacion del mundo <b>" + Monde.label + "</b>";
                    message = "Gracias por confirmar la creacion del mundo <b>" + Monde.label + "</b>";
                } else {
                    titre = "Modificacion del mundo <b>" + Monde.label + "</b>";
                    message = "Gracias por confirmar la modificacion del mundo <b>" + Monde.label + "</b>";
                }
                
                if (documents > 0) {
                    bouton = " (<i>Declasificar</i>)";

                    message += "<pre><b>" + documents + "</b> documentos relacionados seran <b class='with-tip' title='Los documentos declasificados NO son borrados del sistema. Los encontraras en tu fila de espera para volver a clasificarlos.'>declasificados.</b></pre>";
                }
                
                popup_confirmation(message, titre, "Confirmar" + bouton, ajax_save);
            }
        }
        
        if (tuto_on_exit) {
            Tuto.run(2);
        }
    },
    
    _clear: function() {
        popup_designer(function() {
            _bootstrap_designer("new");
        });
    }
};

var bootstrap_templates = function() {
    $("#container-action").hide();
    $("#container-templates").show();
    $("#list-templates").empty().append(
        $("<option></option>")
        .attr("value", "")
    );
    
    $.each(Monde.templates, function(i, template) {
        $("#list-templates").append(
            $("<option></option>")
            .attr("value", i)
            .text(template.titre)
        );
    });
    
    $("#list-templates")
    .chosen({
        inherit_select_classes: true,
        skip_no_results: true
    });
};

var load_template = function() {
    var select = $(this);
    var template = Monde.templates[select.val()];
    
    popup_designer(function() {
        _load_template(template);
    });
};

var _load_template = function(template) {
    Monde.champs = template.champs;
    Monde.label = template.titre.split(" ")[0];
    Monde._refresh();
    
    Tuto.flag(1, 0);
    
    $("#container-ou-champ").hide();
    
    $("#pre-templates").slideUp();
    
    $("#container-description")
    .html(template.description)
    .slideDown();
    
    $("#pre-description").slideDown();
    $("#bouton-save-monde").removeClass("save-monde-KO").addClass("save-monde-OK");
};

var bootstrap_designer = function(action) {
    popup_designer(function() {
        _bootstrap_designer(action);
    });
};

var _bootstrap_designer = function(action) {
    Tuto.flag(0, 0);
    Tuto.flag(1, 1);
    
    $("#liste").slideUp();   
    $(".admin").slideUp();
    $("#designer").fadeIn();
    
    $("#action-champ").show();
    
    $("#bouton-save-monde").unbind().click(Monde._save);
    $("#bouton-clear-monde").unbind().click(Monde._clear);
    $("#bouton-templates").unbind().click(bootstrap_templates);
    $("#bouton-save-champ").unbind().click(designer_save_champ);
    $("#bouton-save-type").unbind().click(designer_save_type);
    $("#bouton-save-categorie").unbind().click(designer_save_categorie);
    $("#add-doc-to-champ").unbind().click(designer_toggle_type);
    $("#add-doc-to-cat").unbind().click(designer_toggle_type);
    $("#add-cat-to-champ").unbind().click(designer_toggle_categorie);
    $("#add-cat-to-champ2").unbind().click(designer_toggle_categorie);
    $(".option-add-champ").unbind().click(designer_toggle_champ);
    $("#nom-monde").unbind().keyup(function() {
        Monde.label = $(this).val();
        if ($(this).val() != "") {
            $(this).removeClass("KO");
        } else {
            $(this).removeClass("OK").addClass("KO");
        }
        check_bouton_save();
    })
    
    $(".designer-add-champ").unbind().click(designer_toggle_champ);
    $("#add-champ").unbind().click(designer_toggle_champ);
    $("#add-champ-cat").unbind().click(designer_toggle_champ);
    $("#add-champ-template").unbind().click(designer_toggle_champ);
    
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
        title: "Comentario",
        OK_text: '<b>Se puede</b> agregar un comentario a este tipo de documento.<br/>',
        KO_text: '<b>No se puede</b> agregar un comentario a este tipo de documento.<br/>',
        tip: "Por ejemplo, contrato 'anual' o contrato 'de servicio'."
    });
    
    Switch($("#time-new-type"), {
        title: "Mensual",
        OK_text: 'Este tipo de documento <b>es mensual</b>',
        KO_text: 'Este tipo de documento <b>no es mensual</b>',
        tip: "Por ejemplo, las facturas pueden ser mensuales."
    });
    
    Monde.pk = undefined;
    Monde.label = "";
    Monde.champs = [];
    Monde.graveyard = [];
    
    $.ajax({
        url: "json/templates.php",
        type: "GET",
        statusCode: {
            200: function(templates) {
                Monde.templates = templates;
                $("#list-templates").unbind().change(load_template);
                if (action != "edit") {
                    bootstrap_templates();
                }
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Erreur!", "error");
            }
        }
    });
    
    if (action == "edit") {
        var pk_monde = $('#mondes-top li[data-selected="1"]').attr("data-monde");
        var monde = profil.mondes[pk_monde];
        
        Monde.pk = pk_monde;
        Monde.label = monde.label;
        Monde.champs = [];
        
        $.each(monde.champs, function(i, champ) {
            var champ_designer = {
                pk: i,
                label: champ.label,
                types: [],
                categories: []
            };
            
            $.each(champ.types, function(j, type) {
                champ_designer.types.push({
                    pk: j,
                    label: type.label,
                    detail: (type.detail == "1"),
                    time: (type.time == "1"),
                    niveau: type.niveau
                });
            });
            
            $.each(champ.categories, function(j, categorie) {
                var categorie_designer = {
                    pk: j,
                    label: categorie.label,
                    niveau: categorie.niveau,
                    types: []
                };
                
                $.each(categorie.types, function(k, type) {
                    categorie_designer.types.push({
                        pk: k,
                        label: type.label,
                        detail: (type.detail == "1"),
                        time: (type.time == "1"),
                        niveau: type.niveau
                    });
                });
                champ_designer.categories.push(categorie_designer);
            });
            Monde.champs.push(champ_designer);
            $(".action").hide();
            $("#bouton-clear-monde").hide();
            $("#designer>h1>span").text("Edicion del mundo ");
    
            Monde._refresh();
            $("#container-action").show();
            $("#action-welcome").show();
            $("#container-templates").hide();
        });
    } else {
        $("#designer>h1>span").text("Creacion del mundo ");
    
        $("#pre-templates").slideDown();
        $("#container-ou-champ").slideDown();
        
        $("#container-description")
        .html("")
        .slideUp();
        
        $("#pre-description").slideUp();
        $("#bouton-save-monde").removeClass("save-monde-OK").addClass("save-monde-KO");
        $("#bouton-clear-monde").hide();
        
        Monde._refresh();
    }
    $("#bouton-save-monde").removeClass("save-monde-OK").addClass("save-monde-KO");
};

var designer_toggle_champ = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var ul;
    var champ;
    
    $(".designer-right").hide();
    $(".action").hide();
    $(".designer-ghost").remove();
    
    $("#container-help").show();
    $("#container-action").show();
    $("#action-champ").fadeIn();
    
    Tuto.flag(2, 1);

    if (bouton.hasClass("designer-add-champ") || bouton.hasClass("option-add-champ")) {
        if (Monde.champs.length == 0) {
            ul = $("#liste-map");
        } else {
            ul = $("ul.designer-champ").last();
        }
        $("#label-new-champ").val("");
        $("#action-champ").attr("data-id", "");
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
        $("#action-champ>h2").html("Campo <b>" + champ.label + "</b>"); // LOCALISATION
    }
    
    $("#label-new-champ").focus();
};

var designer_toggle_type = function() {
    var bouton = $(this);
    var label = $("#label-new-type");
    var detail = $("#detail-new-type");
    var time = $("#time-new-type");
    var niveau = $("#designer-type-niveau");
    var action = $("#action-type");
    var type, li, ul;
    
    $(".designer-right").hide();
    $(".action").hide();
    $(".designer-ghost").remove();
    
    $("#container-action").show();
    
    $("#container-help").show();
    
    Tuto.flag(2, 0);
    Tuto.flag(4, 1);
    
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
        niveau.removeClass("KO").val("0").trigger("chosen:updated");
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
        time.prop('checked', type.time).change();
        niveau.val(type.niveau);
        niveau.trigger("chosen:updated");
    }    
    
    $("#label-new-type").focus();
};

var designer_toggle_categorie = function() {
    var bouton = $(this);
    var label = $("#label-new-categorie");
    var niveau = $("#designer-categorie-niveau");
    var li;
    
    $(".designer-right").hide();
    $(".action").hide();
    $(".designer-ghost").remove();
    
    $("#container-action").show();
    
    $("#container-help").show();
    
    Tuto.flag(2, 0);
    
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
        
        ul.prepend(
            $("<li></li>")
            .addClass("designer-categorie")
            .addClass("designer-ghost")
            .text("Nueva categoria...")  // LOCALISATION
        );
        
        $("#action-categorie>h2").html("Nueva categoria"); // LOCALISATION
        
        label.removeClass("KO").val("");
        niveau.removeClass("KO").val("0").trigger("chosen:updated");
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
    
    $("#label-new-categorie").focus();
};

var designer_save_champ = function() {
    var label = $("#label-new-champ");
    var action = $("#action-champ");
    var champ, id;
    
    if (label.val() == "") {
        label.addClass("KO");
    } else {
        label.removeClass("KO");
        
        champ = {
            label: label.val()
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
        $("#action-champ").attr("data-id", "");
        $("#action-champ>h2").text("Nuevo campo");
        $(".option-help-champ").text(champ.label);
        $(".option-help").attr("data-champ", id);
        $(".option-help").attr("data-categorie", "");
        $("#action-champ").hide();
        $("#action-post-champ").show();
        check_bouton_save();
        Monde._refresh();
    
        Tuto.flag(3, 1);
    }
};

var designer_save_type = function() {
    var label = $("#label-new-type");
    var detail = $("#detail-new-type");
    var time = $("#time-new-type");
    var niveau = $("#designer-type-niveau");
    var action = $("#action-type");
    var champ = Monde.champs[action.attr("data-champ")];
    var type, types, post;
    
    if (label.val() == "") {
        label.addClass("KO");
        label.focus();
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
            check_bouton_save();
            Monde._refresh();
            
            Tuto.flag(5, 1);
        }
    }
};

var designer_save_categorie = function() {
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
            check_bouton_save();
            Monde._refresh();
        }
    }
};

var remove_tree = function() {
    var click = $(this);
    var li = click.closest("li");
    var id = parseInt(li.attr("data-id"));
    var _element;
    var message = "", bouton = "", titre = "Supresion de ", element, post = "champ";
    var champs = 0, types = 0, categories = 0, documents = 0, criteres, retour;
    var go = false;
    
    if (li.hasClass("designer-champ")) {
        element = "el campo <b>" + Monde.champs[id].label + "</b>"; // LOCALISATION
        titre += Monde.champs[id].label;
        types = Monde.champs[id].types.length;
        categories = Monde.champs[id].categories.length;
        $.each(Monde.champs[id].categories, function(i, categorie) {
            types += categorie.types.length;
        });
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
        
        $(".option-help-champ").text(Monde.champs[id - 1].label);
        $(".option-help").attr("data-champ", id);
        $(".option-help").attr("data-categorie", "");
        post = "champ";
    } else {
        if (li.hasClass("designer-categorie")) {
            element = "la categoria <b>" + Monde.champs[li.attr("data-champ")].categories[id].label + "</b>"; // LOCALISATION
            titre += Monde.champs[li.attr("data-champ")].categories[id]; 
            _element = { type: "categorie", id: id, champ: parseInt(li.attr("data-champ"))};
            
            types = Monde.champs[li.attr("data-champ")].categories[id].types.length;
            $(".option-help-champ").text(Monde.champs[li.attr("data-champ")].label);
            $(".option-help").attr("data-champ", li.attr("data-champ"));
            $(".option-help").attr("data-categorie", "");
            post = "champ";
        } else {
            
            if (li.attr("data-categorie") !== undefined && li.attr("data-categorie") !== "") {
                element = "el documento <b>" + Monde.champs[li.attr("data-champ")].categories[li.attr("data-categorie")].types[id].label + "</b>"; // LOCALISATION
                titre += Monde.champs[li.attr("data-champ")].categories[li.attr("data-categorie")].types[id].label;
                $(".option-help-champ").text(Monde.champs[li.attr("data-champ")].label);
                $(".option-help-categorie").text(Monde.champs[li.attr("data-champ")].categories[li.attr("data-categorie")].label);
                $(".option-help").attr("data-champ", li.attr("data-champ"));
                $(".option-help").attr("data-categorie", li.attr("data-categorie"));
                post = "categorie";
            } else {
                element = "el documento <b>" + Monde.champs[li.attr("data-champ")].types[id].label + "</b>"; // LOCALISATION
                titre += Monde.champs[li.attr("data-champ")].types[id].label;
                $(".option-help-champ").text(Monde.champs[li.attr("data-champ")].label);
                $(".option-help").attr("data-champ", li.attr("data-champ"));
                $(".option-help").attr("data-categorie", "");
                post = "champ";
            }
            _element = { type: "type", id: id, champ: parseInt(li.attr("data-champ")), categorie: li.attr("data-categorie") };
            
        }
    }
    
    retour = _count_documents(_element);
    documents = retour.num_docs;
    criteres = retour.criteres;
    
    if (champs != 0 || types != 0 || categories != 0 || documents > 0) {
        message = "Ojo! Si borras " + element + " :<ul>";
        bouton = " (<i>";
        if (documents > 0) {
            message += "<li><b>" + documents + "</b> documentos relacionados seran <b class='with-tip' title='Los documentos declasificados NO son borrados del sistema. Los encontraras en tu fila de espera para volver a clasificarlos.'>declasificados.</b></li>";
            bouton += "Declasificar";
        }
        
        if (champs != 0 || types != 0 || categories != 0) {
            message += "<li><b>" + (champs + types + categories) + "</b> elementos relacionados seran <b>borrados</b>:</li><ul>";
            
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
            if (bouton != " (<i>") {
                bouton += " y ";
            }
            bouton += "Borrar"
        }
        
        message += "</ul>";
        bouton += " </i>)";
    } else {
        message += "Gracias por confirmar la supresion.";
    }
    
    var bilan = {
        documents: documents,
        champs: champs,
        categories: categories,
        types: types
    };
    
    var callback = function() {
        _remove_tree(_element, criteres, bilan);
        $(".action").hide();
        $("#action-post-" + post).show();
    };
    
    popup_confirmation(message, titre, "Confirmar" + bouton, callback);
};

var _count_documents = function(element) {
    var no_doc = false, break_on_child, pk;
    var type;
    var criteres = {};
    var is_on = false, docs = 0;
    
    // Si l'élément n'a pas de pk, alors il ne peut pas avoir de documents
    // Sinon selon son type :
    // - champ : tous les docs situés après ce champ dans la Liste sont supprimables.
    //           le break se fait sur les champs parents
    // - categorie : tous les docs situés après cette catégorie dans la Liste sont supprimables.
    //               le break se fait sur le prochain champ(fils ou parent) ou catégorie
    // - type de doc : seulement les docs qui ont ce type sont concernés
    //                 le break se fait sur le prochain champ(fils ou parent) ou catégorie
    
    // Selon l'élément on détermine les critères
    switch(element.type) {
        case "champ":
            if (Monde.champs[element.id].pk === undefined) {
                no_doc = true;
            } else {
                break_on_child = false;
                criteres["champ"] = Monde.champs[element.id].pk;
            }
            break;
        case "categorie":
            if (Monde.champs[element.champ].categories[element.id].pk === undefined) {
                no_doc = true;
            } else {
                break_on_child = true;
                criteres["champ"] = Monde.champs[element.champ].pk;
                criteres["categorie"] = Monde.champs[element.champ].categories[element.id].pk;
            }
            break;
        case "type":
            if (element.categorie !== undefined && element.categorie !== "") {
                type = Monde.champs[element.champ].categories[element.categorie].types[element.id];
            } else {
                type = Monde.champs[element.champ].types[element.id];
            }
            
            if (type.pk === undefined) {
                no_doc = true;
            } else {
                break_on_child = true;
                criteres["champ"] = Monde.champs[element.champ].pk;
                
                if (element.categorie !== undefined && element.categorie !== "") {
                    criteres["categorie"] = Monde.champs[element.champ].categories[element.categorie].pk;
                }
                criteres["type"] = type.pk;
            }
            break;
    };
    
    // Et on boucle sur la Core.liste pour compter les docs
    if (!no_doc) {
        $.each(Core.liste, function(i, ligne) {
            switch(ligne.type) {
                case "champ":
                    if (profil.mondes[Core.monde].cascade[ligne.niveau] == criteres.champ) {
                        if (criteres.categorie === undefined) {
                            is_on = true;
                        } else {
                            is_on = false;  
                        }
                    } else {
                        if (parseInt(profil.mondes[Core.monde].cascade[ligne.niveau]) < parseInt(criteres.champ)) {
                            is_on = false;
                        } else {
                            is_on = !break_on_child;
                        }
                    }
                    break;
                case "categorie":                    
                    if (criteres.categorie === undefined) {
                        is_on = (is_on && !break_on_child);
                    } else {
                        if (ligne.pk != criteres.categorie) {
                            is_on = (is_on && !break_on_child);
                        } else {
                            is_on = true;
                        }
                    }
                    break;
                case "an":
                case "mois":
                    break;
                default:
                    docs += (is_on && (ligne.type == (criteres.type || ligne.type))) * ligne.revision;
                    break;
            }
        });
    }
    
    return {
        num_docs: docs,
        criteres: criteres
    };
}

var _remove_tree = function(element, criteres, bilan) {
    switch(element.type) {
        case "champ":
            Monde.champs.splice(element.id);
            if (criteres.champ !== undefined) {
                Monde.graveyard.push({
                    type: "champ",
                    pk: criteres.champ,
                    bilan: bilan
                });
                check_bouton_save();
            }
            break;
        case "categorie":
            Monde.champs[element.champ].categories.splice(element.id, 1);
            if (criteres.categorie !== undefined) {
                Monde.graveyard.push({
                    type: "categorie",
                    champ: criteres.champ,
                    pk: criteres.categorie,
                    bilan: bilan
                });
                check_bouton_save();
            }
            break;
        case "type":
            if (element.categorie !== undefined && element.categorie !== "") {
                Monde.champs[element.champ].categories[element.categorie].types.splice(element.id, 1);
                if (criteres.type !== undefined) {
                    Monde.graveyard.push({
                        type: "type",
                        champ: criteres.champ,
                        categorie: criteres.categorie,
                        pk: criteres.type,
                        bilan: bilan
                    });
                    check_bouton_save();
                }
            } else {
                Monde.champs[element.champ].types.splice(element.id, 1);
                if (criteres.type !== undefined) {
                    Monde.graveyard.push({
                        type: "type",
                        champ: criteres.champ,
                        pk: criteres.type,
                        bilan: bilan
                    });
                    check_bouton_save();
                }
            }
            break;
    };
    Monde._refresh();
}

var check_bouton_save = function() {
    Monde.modif = true;
    if (Monde.champs.length > 0) {
        $("#bouton-save-monde").removeClass("save-monde-KO").addClass("save-monde-OK");
        if (Monde.pk === undefined) {
            $("#bouton-clear-monde").show();
        }
    } else {
        $("#bouton-save-monde").removeClass("save-monde-OK").addClass("save-monde-KO");
        $("#bouton-clear-monde").hide();
    }
};
