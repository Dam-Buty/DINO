
var bootstrap_profil = function() {
    var monde = profil.mondes[$("#liste-profil").attr("data-monde")];
    var ul = $("#liste-profil").empty();
    var marge = 0;
    var niveau = 0;
    
    // Pour chaque champ, dans l'ordre
    $.each(monde.cascade, function(i, pk) {
        var marge_base = marge;
        var champ = monde.champs[pk];
        var new_ul = $("<ul></ul>").css("margin-left", marge + "%");
        
        // On affiche le champ
        ul.append(affiche_ligne("champ", pk, champ.label, marge));
        ul.append(new_ul);
        ul = new_ul;
                
        marge += 2;
        
        // NEW type
        ul.append(affiche_ligne("type", "new", "", marge, { detail: "0", niveau: "0" }));
        
        // On liste les types en racine
        $.each(champ.types, function(j, type) {
            ul.append(affiche_ligne("type", j, type.label, marge, type));
        });
        
        // NEW categorie
        ul.append(affiche_ligne("categorie", "new", "", marge, { niveau: "0" }));
        
        // On liste les catégories et leurs types
        $.each(champ.categories, function(j, categorie) {
            var ul_categorie = $("<ul></ul>").css("margin-left", marge + "%");
            
            ul.append(affiche_ligne("categorie", j, categorie.label, marge, categorie));
            
            marge += 2;
            
            // NEW type
            ul_categorie.append(affiche_ligne("type", "new", "", marge, { detail: "0", niveau: "0" }));
            
            $.each(categorie.types, function(k, type) {
                ul_categorie.append(affiche_ligne("type", k, type.label, marge, type));
            });
            
            ul.append(ul_categorie);
            
            marge -= 2;
        });
        
        marge = marge_base + 2;
        niveau++;
    });
    
    $(".edit-niveau").chosen({
        disable_search_threshold: 10
    })
};

var affiche_ligne = function(type, pk, label, marge, obj) {
    var message = "";
    var select, input;
    
    switch(type) {
        case "type": 
            message = "Agregar un tipo de documentos";
            break;
        case "categorie":
            message = "Agregar una categoria de documentos";
            break;
    }
    
    var li = $("<li></li>")
        .addClass("liste")
        .addClass("profil")
        .addClass("profil-" + type)
        .attr({
            "data-type": type,
            "data-pk": pk
        })
        .css("margin-left", marge + "%")
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
        
    if (type == "categorie" || type == "type") {
        select = $("<select></select>")
            .addClass("edit-niveau")
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
        
    switch(type) {
        case "type": 
            message = "Agregar un tipo de documentos";
            break;
        case "categorie":
            message = "Agregar una categoria de documentos";
            break;
    }
    
    li.append(
        $("<img/>")
        .attr("src", "img/OK.png")
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

var save_profil = function() {
    var monde = $("#liste-profil").attr("data-monde");
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
