
var bootstrap_profil = function() {
    var monde = profil.mondes[Core.monde];
    var ul = $("#liste-profil").empty();
    var marge = 0;
    var niveau = 0;
    
    $("#liste").slideUp();
    $("#mondes").slideUp();
    $("#profil").fadeIn();
    
    // On met le monde en statut sélectionné
    li.closest("ul").find("li").attr("data-selected", "0");
    li.attr("data-selected", "1");
    
    // Pour chaque champ, dans l'ordre
    $.each(monde.cascade, function(i, pk) {
        var marge_base = marge;
        var champ = monde.champs[pk];
        var new_ul = $("<ul></ul>").css("margin-left", marge + "%").addClass("liste-champ");
        var hasTime = false;
        
        // On affiche le champ
        ul.append(affiche_ligne("champ", pk, champ.label, marge, {niveau: i}));
        ul.append(new_ul);
        ul = new_ul;
                
        marge += 2;
        
        // NEW categorie
        ul.append(affiche_ligne("categorie", "new", "", marge, { niveau: "0" }));
        
        
        // NEW type
        ul.append(affiche_ligne("type", "new", "", marge, { detail: "0", niveau: "0" }));
        
        // On liste les types *non time* en racine 
        $.each(champ.types, function(j, type) {
            if (type.time == 0) {
                ul.append(affiche_ligne("type", j, type.label, marge, type));
            } else {
                hasTime = true;
            }
        });
        
        // On liste les catégories *non time* et leurs types
        $.each(champ.categories, function(j, categorie) {
            if (categorie.time == 0) {
                var ul_categorie = $("<ul></ul>").css("margin-left", marge + "%").addClass("liste-categorie");
                
                ul.append(affiche_ligne("categorie", j, categorie.label, marge, categorie));
                
                marge += 2;
                
                // NEW type
                ul_categorie.append(affiche_ligne("type", "new", "", marge, { detail: "0", niveau: "0" }));
                
                $.each(categorie.types, function(k, type) {
                    ul_categorie.append(affiche_ligne("type", k, type.label, marge, type));
                });
                
                ul.append(ul_categorie);
                
                marge -= 2;
            } else {
                hasTime = true;
            }
        });
        
        // Si on a du time, on ajoute la ligne An et la ligne Mois
        if (hasTime) {
            marge += 2;
            
            var li_an = $("<li></li>")
                        .attr({
                            "data-type": "champ"
                        })
                        .css("margin-left", marge + "%")
                        .addClass("profil")
                        .addClass("profil-champ")
                        .addClass("liste")
                        .html("A&ntilde;o");
                        
            var ul_an = $("<ul></ul>")
                        .css("margin-left", marge + "%")
                        .addClass("liste-champ");
                        
            var li_mois = $("<li></li>")
                        .attr({
                            "data-type": "champ"
                        })
                        .css("margin-left", (marge + 2) + "%")
                        .addClass("profil")
                        .addClass("profil-champ")
                        .addClass("liste")
                        .html("Mes");
                        
            var ul_mois = $("<ul></ul>")
                        .css("margin-left", (marge + 2) + "%")
                        .addClass("liste-champ");
            
            
            ul.append(
                li_an
            ).append(
                ul_an.append(
                    li_mois
                ).append(
                    ul_mois
                )
            );
            
            marge += 2;
            
            // Puis on ajoute les types et catégories time
            $.each(champ.types, function(j, type) {
                if (type.time == 1) {
                    ul_mois.append(affiche_ligne("type", j, type.label, marge, type));
                }
            });
            
            $.each(champ.categories, function(j, categorie) {
                if (categorie.time == 1) {
                    var ul_categorie = $("<ul></ul>").css("margin-left", marge + "%").addClass("liste-categorie");
                    
                    ul_mois.append(affiche_ligne("categorie", j, categorie.label, marge, categorie));
                    
                    marge += 2;
                    
                    // NEW type
                    ul_categorie.append(affiche_ligne("type", "new", "", marge, { detail: "0", niveau: "0" }));
                    
                    $.each(categorie.types, function(k, type) {
                        ul_categorie.append(affiche_ligne("type", k, type.label, marge, type));
                    });
                    
                    ul_mois.append(ul_categorie);
                    
                    marge -= 2;
                }
            });
        }
        
        marge = marge_base + 2;
        niveau++;
    });
    
    $("#liste-profil li").not(".add-profil").find(".edit-niveau-profil").chosen({
        disable_search_threshold: 10,
        inherit_select_classes: true
    });
    
    collapse_liste($("#liste-profil"), "open");
}

var affiche_ligne = function(type, pk, label, marge, obj) {
    var message = "";
    var select, input, pre_input;
    
    switch(type) {
        case "type": 
            message = "Agregar un tipo de documentos";
            break;
        case "categorie":
            message = "Agregar una categoria de documentos";
            break;
        case "champ":
            pre_input = "Nivel " + (obj.niveau + 1) + " : ";
            break;
    }
    
    var li = $("<li></li>")
        .attr({
            "data-type": type,
            "data-pk": pk
        })
        .css("margin-left", marge + "%")
        .append(pre_input)
        .append(
            $("<input/>")
            .attr({
                type: "text",
                "placeholder": message
            })
            .addClass("profil")
            .val(label)
            .keyup(toggle_edit_profil)
        );
        
    if (type == "categorie" || type == "type") {
    
        if (type == "type") {
            input = $("<input></input>")
                .attr("type", "checkbox")
                .change(toggle_edit_profil)
                ;
                
            if (obj.detail == 1) {
                input.attr("checked", "checked");
            }
                
            li.append(input).append("Detalle");
        }
        
        select = $("<select></select>")
            .addClass("edit-niveau-profil")
            .attr("data-placeholder", "Selectionar un nivel")
            .append(
                $("<option></option>")
                .attr("value", 0)
                .text("Visitor")
            )
            .append(
                $("<option></option>")
                .attr("value", 10)
                .text("Archivista")
            )
            .append(
                $("<option></option>")
                .attr("value", 20)
                .text("Administrador")
            )
            .change(toggle_edit_profil);
            
        if (profil.niveau >= 30) {
            select.append(
                $("<option></option>")
                .attr("value", 30)
                .text("Gerente")
            );
        }
            
        select.val(obj.niveau);
            
        li.append(
            $("<span></span>")
            .text("Visible a partir del nivel : ")
            .append(
                select
            )
        );
    }
    
    if (pk != "new") {
        if (type == "champ") {
            li.append(
                $("<img/>")
                .attr("src", "img/categorie_20.png")
                .addClass("profil-toggle-categorie")
                .click(toggle_categorie_profil)
            );
        }
        
        if (type == "champ" || type == "categorie") {
            li.append(
                $("<img/>")
                .attr("src", "img/document_20.png")
                .addClass("profil-toggle-type")
                .click(toggle_type_profil)
            )
        }
    
        li.addClass("liste")
        .addClass("profil")
        .addClass("profil-" + type);
    } else {
        li.addClass("add-profil")
        .addClass("profil")
        .addClass("add-profil-" + type);
    }
    
    li.append(
        $("<img/>")
        .attr("src", "img/save_back_20.png")
        .addClass("profil-save")
        .click(save_profil)
    );

    return li;
};

var toggle_edit_profil = function() {
    var input = $(this);
    var li = input.closest("li");
    
    input.addClass("modified");
    li.find(".profil-save").fadeIn();
};

var toggle_categorie_profil = function() {
    var img = $(this);
    var li = img.closest("li");
    var li_new = li.next("ul").children(".add-profil-categorie");
    
    if (li_new.is(":visible")) {
        li_new.slideUp();
    } else {
        if (li.attr("data-state") == "closed") {
            li.children("div").click();
        }
        li_new.slideDown({
            complete: function() {
                if (li_new.find(".chosen-container").length == 0) {
                    li_new.find(".edit-niveau-profil").chosen({
                        disable_search_threshold: 10,
                        inherit_select_classes: true
                    });
                }
            }
        });
    }
    
};

var toggle_type_profil = function() {
    var img = $(this);
    var li = img.closest("li");
    var li_new = li.next("ul").children(".add-profil-type");
    
    if (li_new.is(":visible")) {
        li_new.slideUp();
    } else {
        if (li.attr("data-state") == "closed") {
            li.children("div").click();
        }
        li_new.slideDown({
            complete: function() {
                if (li_new.find(".chosen-container").length == 0) {
                    li_new.find(".edit-niveau-profil").chosen({
                        disable_search_threshold: 10,
                        inherit_select_classes: true
                    });
                }
            }
        });
    }
    
};

var save_profil = function() {
    var monde = Core.monde;
    var click = $(this);
    var li = click.closest("li");
    var type = li.attr("data-type");
    var pk = li.attr("data-pk");
    var label = li.find("input").eq(0).val();
    var niveau = li.find("select").val();
    var champ, categorie, detail;
       
    switch(type) {
        case "champ":
            $.ajax({
                url: "do/doSaveChamp.php",
                type: "POST",
                data: {
                    monde: monde,
                    pk: pk,
                    label: label
                },
                statusCode : {
                    200: function() {
                        popup("El label '" + label + "' ha sido modificado con exito!", "confirmation");
                        _profil(bootstrap_profil);
                    },
                    403: function() {
                        window.location.replace("index.php");
                    },
                    500: function() {
                        popup("Error! Gracias por intentar otra vez...", "error");
                    }
                }
            });
            break;
        case "categorie":
            // On recupere le champ
            champ = li.closest("ul").prev("li").attr("data-pk");
            
            $.ajax({
                url: "do/doSaveCategorie.php",
                type: "POST",
                data: {
                    monde: monde,
                    champ: champ,
                    pk: pk,
                    label: label,
                    niveau: niveau
                },
                statusCode : {
                    200: function() {
                        popup("La categoria '" + label + "' ha sido modificada con exito!", "confirmation");
                        _profil(bootstrap_profil);
                    },
                    403: function() {
                        window.location.replace("index.php");
                    },
                    500: function() {
                        popup("Error! Gracias por intentar otra vez...", "error");
                    }
                }
            });
            break;
        case "type":
            // On recupere le champ et la categorie
            var li_parent = li.closest("ul").prev("li");
            
            if (li_parent.attr("data-type") == "categorie") {
                categorie = li_parent.attr("data-pk");
                champ = li_parent.closest("ul").prev("li").attr("data-pk");
            } else {
                categorie = 0;
                champ = li_parent.attr("data-pk");
            }
            
            if (li.find("input").eq(1).prop("checked")) {
                detail = 1;
            } else {
                detail = 0;
            }
            
            $.ajax({
                url: "do/doSaveType.php",
                type: "POST",
                data: {
                    monde: monde,
                    champ: champ,
                    categorie: categorie,
                    pk: pk,
                    label: label,
                    niveau: niveau,
                    detail: detail
                },
                statusCode : {
                    200: function() {
                        popup("El tipo de documento '" + label + "' ha sido modificado con exito!", "confirmation");
                        _profil(bootstrap_profil);
                    },
                    403: function() {
                        window.location.replace("index.php");
                    },
                    500: function() {
                        popup("Error! Gracias por intentar otra vez...", "error");
                    }
                }
            });
            
            break;
    }
};
