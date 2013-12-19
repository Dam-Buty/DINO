
var Drag = {
    timeout: undefined,
    delay: 400,
    interval: undefined,
    idelay: 400,
    scroll: 60
};

var dragstart = function(e) {
    var dragged = this;
    $(this).fadeTo("fast", 0.4);
    var monde = profil.mondes[Core.monde];
    
    $(this).find(".details-queue").hide();
    $(this).find("img").hide();
    $(this).css("border-bottom", 0);
    $(this).find(".filename").css("margin-right", 0);
    
    e.originalEvent.dataTransfer.setDragImage(dragged, 0, 0);
        
    e.originalEvent.dataTransfer.effectAllowed = 'move';
    e.originalEvent.dataTransfer.setData('text/html', $(this).attr("data-position"));
    
    //e.originalEvent.dataTransfer.setDragImage($("<img/>").attr("src", "img/dino_100.png")[0], 0, 0);
    
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
        .append(
            $("<span></span>")
            .text("Otro " + monde.champs[monde.cascade[0]].label + "...") // LOCALISATION
        )
        .on("dragenter", dragenter)
        .on("dragover", dragover)
        .on("dragleave", dragleave);
    
    $("#liste>ul").prepend(li);
    li.slideDown();
};

var dragend = function(e) {
    $(this).fadeTo("fast", 1);
//    $(".ghost").slideUp({ complete: function() {
//        $(".ghost").remove();
//    }});
//    $(".ghost-word").remove();
//    $(".over").removeClass("over");
//    $("#liste li").removeClass("hovering");
//    $('img[data-type="palomita"]').show();
    
    $(this).find(".details-queue").slideDown();
    $(this).find("img").fadeIn();
    $(this).css("border-bottom", "");
    $(this).find(".filename").css("margin-right", "");
};

var dragover = function(e) {
    e.preventDefault(); 

    e.originalEvent.dataTransfer.dropEffect = 'move';
};

// TODO : Si il existe un Contrato "de servicio", on ne peut pas dragdroper
//          pour un Contrato "de otra cosa"

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
                
                ul.children("li").find('div[data-state="open"]').click();
                
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
                        $('.ghost[data-niveau="' + niveau + '"]').find("div").attr("data-state", "closed");
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
                            
                            marge = (niveau + 2) * 2;
                            li.after(new_li.css({ "margin-left": marge + "%" }));
                        }
                    });
                    
                } else {
                    champ = monde.champs[monde.cascade[li.attr("data-niveau")]];
                    
                    // On ferme les enfants ouverts
                    li.next("ul").children('ul').slideUp();
                    // les siblings ouverts
                    li.siblings("li").next("ul").slideUp();
                    // les lignes ghost
                    $(".ghost").not(".ghost-first").remove();
                    $(".ghost-word").remove();
                    $("ul[data-ghost]").remove();
                    
                    
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
                                label: type.label,
                                categorie: 0,
                                stack: li.attr("data-stack")
                            });
                        } else {
                            new_li = $(types[i]);
                            new_li.find("div").prepend(
                                $("<span></span>")
                                .addClass("ghost-word")
                                .text("Replazar ") // LOCALISATION
                            )
                        }
                        marge = li.attr("data-stack").split(",").length * 2;
                        ul.append(new_li.css({ "margin-left": marge + "%" }).show());
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
                                    label: type.label,
                                    categorie: i,
                                    stack: li.attr("data-stack")
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
                            new_ul.append(li_type.css({ "margin-left": marge + "%" }));
                        });
                        
                        marge = li.attr("data-stack").split(",").length * 2;
                        ul.append(new_li.css({ "margin-left": marge + "%" }));
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
                                label_champ: monde.champs[monde.cascade[niveau]].label,
                                pk: i, 
                                niveau: niveau, 
                                stack: li.attr("data-stack"), 
                                label: monde.champs[monde.cascade[niveau]].liste[i]
                            });
                            
                            marge = (niveau) * 2;
                            li.after(new_li.css({ "margin-left": marge + "%" }));
                        }
                        ul.append(new_li);
                    });
            }
                    
            ul.slideDown();
            
            ul.find('ul[data-ghost]').find("li").slideDown();
            break;
        };
    }, Drag.delay);

    return false;
};

var dragleave = function(e) {
    if (checkleave(e)) {
        $(this).removeClass("over");
    }
};

var drop = function(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    var monde = profil.mondes[Core.monde];
    var position = e.originalEvent.dataTransfer.getData('text/html');
    var document = queue[position];
    var store = document.store;
    var li = $(this);
    
    var stack = li.attr("data-stack").split(",");
    
    store.monde = Core.monde;
    
    // On récupère les valeurs de champs dans le stack
    store.champs = {};
    
    $.each(stack, function(i, valeur) {
        store.champs[monde.cascade[i]] = valeur;
        store.last_champ = monde.cascade[i];
    });
    
    // Si on a droppé directement sur un document
    // on affiche les champs date et détail    
    if (li.attr("data-type") == "document") {
        store.categorie = li.attr("data-categorie");
        store.type_doc = { pk: li.attr("data-type-doc"), detail: "" };
        store.detail = li.attr("data-detail");
        
        document.li.removeClass("done");
        document.li.attr("data-editing", 1);
        
        var type;
        
        if (store.categorie == 0) {
            type = monde.champs[store.last_champ].types[store.type_doc.pk];
        } else {
            type = monde.champs[store.last_champ].categories[store.categorie].types[store.type_doc.pk];
        }
        
        if (type.detail == 1) {
            $("#input-detail").show();
            $("#detail-store").val(store.detail);
        } else {
            $("#input-detail").hide();
        }
        
        $("#popup-store").attr("data-document", position);
        $("#bouton-store").unbind().click(archive_document);
        
        popup_details();
    } else {
        _store_document(position);
    }
    
    return false;
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
            "data-stack": params.stack + params.pk
        })
        .append(
            $("<span></span>")
            .append("Agregar al " + params.label_champ + " <u>" + params.label + "</u>")
        ) // LOCALISATION
        .on("dragenter", dragenter)
        .on("dragover", dragover)
        .on("dragleave", dragleave)
        .on("drop", drop);
};



var ghost_type = function(params) {
    return $("<li></li>")
        .addClass("ghost-type")
        .addClass("ghost")
        .attr({
            "data-type": "document",
            "data-type-doc": params.pk,
            "data-categorie": params.categorie,
            "data-stack": params.stack
        })
        .append(
            $("<span></span>")
            .text("Nuevo " + params.label) // LOCALISATION
        )
        .on("dragenter", dragenter)
        .on("dragover", dragover)
        .on("dragleave", dragleave)
        .on("drop", drop);
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
            $("<span></span>")
            .append(params.label)
        );
};

var scroll = function(i) {
    $("#core").animate({
        scrollTop: $("#core").scrollTop() + i * Drag.scroll
    }, Drag.idelay, "linear");    
};

var scrollup = function(e) {
    scroll(-1);
    clearInterval(Drag.interval);
    Drag.interval = setInterval(function() {
        scroll(-1);
    }, Drag.idelay);
};

var scrolldown = function(e) {
    scroll(1);
    clearInterval(Drag.interval);
    Drag.interval = setInterval(function() {
        scroll(1);
    }, Drag.idelay);
};

var scrollstop = function(e) {
    if (checkleave(e)) {
        clearInterval(Drag.interval);
        $("#core").stop();
    }
};

// On vérifie que le dragleave n'a pas été levé
// par un élément fils en vérifiant que la souris
// est restée dans les coordonnées de l'élément parent
var checkleave = function(e) {
    var x = e.originalEvent.x;
    var y = e.originalEvent.y;
    var element = $(e.target);
    
    var arrondi = function(string) {
        return Math.ceil(parseFloat(string));
    }
    
    var min_x = element.offset().left + arrondi(element.css("margin-left")) + arrondi(element.css("border-left")) + arrondi(element.css("padding-left"));
    var max_x = element.offset().left + element.outerWidth() - 2;
    var min_y = element.offset().top + arrondi(element.css("margin-top")) + arrondi(element.css("border-top")) + arrondi(element.css("padding-top"));
    var max_y = element.offset().top + element.outerHeight() - 2;
    
    return x < min_x || x > max_x || y < min_y || y > max_y;  
}
