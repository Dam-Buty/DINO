
var Drag = {
    timeout: undefined,
    delay: 400
};

var dragstart = function(e) {
    $(this).fadeTo("fast", 0.4);
    var monde = profil.mondes[Core.monde];
    
    e.originalEvent.dataTransfer.effectAllowed = 'move';
    e.originalEvent.dataTransfer.setData('text/html', $(this).attr("data-position"));
    
    // On cache les palomitas
    $('img[data-type="palomita"]').hide();
    
    $("#liste li").addClass("hovering");
    
    // On ajoute le Nuevo xxx pour le premier champ
    var li = $("<li></li>")
        .addClass("ghost-first")
        .addClass("ghost-champ")
        .addClass("ghost")
        .attr({
            "data-type": "champ",
            "data-champ": monde.cascade[0],
            "data-pk": "new",
            "data-niveau": -1,
            "data-stack": ""
        })
        .text("Otro " + monde.champs[monde.cascade[0]].label + "...") // LOCALISATION
        .on("dragenter", dragenter)
        .on("dragover", dragover)
        .on("dragleave", dragleave);
    
    $("#liste>ul").prepend(li);
    li.slideDown();
};

var dragend = function(e) {
    $(this).fadeTo("fast", 1);
    $(".ghost").slideUp({ complete: function() {
        $(".ghost").remove();
    }});
    $(".ghost-word").remove();
    $(".over").removeClass("over");
    $("#liste li").removeClass("hovering");
    $('img[data-type="palomita"]').show();
};

var dragover = function(e) {
    e.preventDefault(); 

    e.originalEvent.dataTransfer.dropEffect = 'move';
};



var ghost_champ = function(params) {
    if (params.stack != "") {
        params.stack += ",";
    }
    
    return $("<li></li>")
        .addClass("ghost-champ")
        .addClass("ghost")
        .attr({
            "data-type": "champ",
            "data-champ": params.champ,
            "data-pk": params.pk,
            "data-niveau": params.niveau,
            "data-stack": params.stack
        })
        .append(
            $("<div></div>")
            .attr({
                "data-type": "champ",
                "data-state": "closed"
            })
            .addClass("imgboutons")
        )
        .append("Agregar a " + params.label) // LOCALISATION
        .on("dragenter", dragenter)
        .on("dragover", dragover)
        .on("dragleave", dragleave);
};



var ghost_type = function(params) {
    return $("<li></li>")
        .addClass("ghost-type")
        .addClass("ghost")
        .attr({
            "data-type": "document",
            "data-type-doc": params.pk
        })
        .text("Nuevo " + params.label) // LOCALISATION
        .on("dragenter", dragenter)
        .on("dragover", dragover)
        .on("dragleave", dragleave);
};

var ghost_categorie = function(params) {
    return $("<li></li>")
        .addClass("ghost-categorie")
        .addClass("ghost")
        .attr({
            "data-type": "categorie",
            "data-categorie": params.pk
        })
        .append(
            $("<div></div>")
            .attr({
                "data-type": "categorie",
                "data-state": "open"
            })
            .addClass("imgboutons")
        )
        .append(params.label)
        .on("dragenter", dragenter)
        .on("dragover", dragover)
        .on("dragleave", dragleave);
};

var dragenter = function(e) {
    var li = $(this);
    var ul = li.next("ul");
    var monde = profil.mondes[Core.monde];
    var champ = undefined;
    
    li.addClass("over");
    
    clearTimeout(Drag.timeout);
    
    // On introduit un delay pour éviter que ça danse trop
    Drag.timeout = setTimeout( function() {
        
        
        
        // Selon l'élément sur lequel on dragge
        switch(li.attr("data-type")) {
            case "champ":
                // On ferme tous les autres champs
                li.closest("ul").children("li").find('div[data-state="open"]').not(li.find("div")).click();
                console.log(li.closest("ul").children("li"));
                
                ul.children("li").find('div[data-state="open"]').click();
                li.closest("ul").children('li[data-type="document"]').slideUp();
                
                li.attr("data-state", "open");
                
                var new_li;
                var new_ul;
                
                if (li.hasClass("ghost")) {
                    var niveau = parseInt(li.attr("data-niveau"));
                    
                    champ = monde.champs[monde.cascade[niveau + 1]];
                    
                    // On cache les bonnes lignes (c'est compliqué...)
                    if (li.hasClass("ghost-first")) {
                        $(".ghost").not(".ghost-first").remove();
                        $(".ghost-word").remove();
                        $("ul[data-ghost]").removeAttr("data-ghost");
                        parent = 0;
                    } else {
                        parent = li.attr("data-pk");
                        $(".ghost").not(".ghost-first").filter(function(){
                            return  parseInt($(this).attr("data-niveau")) > niveau;
                        }).slideUp({
                            complete: function() { this.remove(); }
                        });
                    }
                    
                    ul = li.closest("ul");
                    
                    if (monde.references[parent] !== undefined) {
                        li.find("div").attr("data-state", "open");
                    }
                    
                    // On ghoste toutes les valeurs de champs non représentées
                    $.each(monde.references[parent] || [], function(i, valeur) {
                        if ($('li[data-type="champ"][data-pk="' + i + '"]').length == 0) {
                            var new_li = ghost_champ({
                                champ: monde.cascade[niveau + 1], 
                                pk: i, 
                                niveau: niveau + 1, 
                                stack: li.attr("data-stack"), 
                                label: champ.liste[i]
                            });
                            
                            marge = (niveau + 1) * 2;
                            li.after(new_li.css({ "padding-left": marge + "%" }));
                        }
                    });
                    
                } else {
                    champ = monde.champs[monde.cascade[li.attr("data-niveau")]];
                    
                    $(".ghost").not(".ghost-first").remove();
                    $(".ghost-word").remove();
                    $("ul[data-ghost]").removeAttr("data-ghost");
                    li.find("div").attr("data-state", "open");
                    
                    /////////////////////////
                    // On détache tous les sous-éléments
                    // - Champs
                    var champs = {};
                    
                    $.each(ul.children('li[data-type="champ"]'), function(i, champ) {
                        champs[$(champ).attr("data-pk")] = {
                            li: champ,
                            ul: $(champ).next("ul")
                        };
                        $(champ).detach();
                        $(champ).next("ul").detach();
                    });
                    
                    // - Types
                    var types = {};
                    $.each(ul.children('li[data-type="document"]'), function(i, document) {
                        types[$(document).attr("data-type-doc")] = document;
                        $(document).detach();
                    });
                    
                    // - Catégories
                    var categories = {};
                    $.each(ul.children('li[data-type="categorie"]'), function(i, categorie) {
                        categories[$(categorie).attr("data-pk")] = {
                            categorie: categorie,
                            types: {}
                        };
                        $.each($(categorie).next("ul").find("li"), function(j, type) {
                            categories[$(categorie).attr("data-pk")].types[$(type).attr("data-type-doc")] = type;
                            $(type).detach();
                        });
                        $(categorie).detach();
                        $(categorie).next("ul").remove();
                    });
                    
                    //////////////////////////////////////////
                    // On ghoste les lignes qui n'existent pas, on repose les autres
                    // - Types
                    $.each(champ.types, function(i, type) {
                        if (types[i] === undefined) {
                            new_li = ghost_type({
                                pk: i,
                                label: type.label
                            });
                        } else {
                            new_li = $(types[i]);
                            new_li.find("div").prepend(
                                $("<span></span>")
                                .addClass("ghost-word")
                                .text("Replazar ") // LOCALISATION
                            )
                        }
                        marge = li.attr("data-stack").split(",").length * 2 + 2;
                        ul.append(new_li.css({ "padding-left": marge + "%" }));
                    }); // FIN EACH TYPE
                    
                    // - Catégories + types
                    $.each(champ.categories, function(i, categorie) {
                        if (categories[i] === undefined) {
                            new_li = ghost_categorie({
                                pk: i, 
                                label: categorie.label
                            });
                        } else {
                            new_li = $(categories[i].categorie).attr("data-state", "open");
                            new_li.find("div").attr("data-state", "open");
                        }
                        
                        new_ul = $("<ul></ul>")
                            .attr("data-stack", li.attr("data-stack"))
                            .attr("data-ghost", 1);
                          
                        // Les types de cette catégorie
                        $.each(categorie.types, function(j, type) {
                            var li_type;
                            
                            if (categories[i] === undefined || categories[i].types[j] === undefined) {
                                li_type = ghost_type({
                                    pk: j,
                                    label: type.label
                                });
                            } else {
                                li_type = $(categories[i].types[j]);
                                li_type.find("div").prepend(
                                    $("<span></span>")
                                    .addClass("ghost-word")
                                    .text("Replazar ") // LOCALISATION
                                );
                            }
                            marge = li.attr("data-stack").split(",").length * 2 + 4;
                            new_ul.append(li_type.css({ "padding-left": marge + "%" }));
                        });
                        
                        marge = li.attr("data-stack").split(",").length * 2;
                        ul.append(new_li.css({ "padding-left": marge + "%" }));
                        ul.append(new_ul);
                    }); // FIN EACH CATEGORIE
                    
                    // - Champs présents
                    $.each(champs, function(i, ligne) {
                        ul.append(ligne.li);
                        ul.append(ligne.ul);
                    });
                    
                    // - Champs non présents
                    $.each(monde.references[li.attr("data-pk")] || [], function(i, valeur) {
                        var niveau = parseInt(li.attr("data-niveau")) + 1;
                        if (champs[i] === undefined) {
                            var new_li = ghost_champ({
                                champ: monde.cascade[niveau], 
                                pk: i, 
                                niveau: niveau, 
                                stack: li.attr("data-stack"), 
                                label: monde.champs[monde.cascade[niveau]].liste[i]
                            });
                            
                            marge = (niveau) * 2;
                            li.after(new_li.css({ "padding-left": marge + "%" }));
                        }
                        ul.append(new_li);
                    });
            }
                    
            ul.children("li").slideDown();
            
            ul.find('ul[data-ghost]').find("li").slideDown();
            break;
        };
    }, Drag.delay);

    return false;
};

var dragleave = function(e) {
    var li = $(this);
    
    li.removeClass("over");
};
