
var Drag = {
    timeout: undefined,
    delay: 200
};

var dragstart = function(e) {
    $(this).fadeTo("fast", 0.4);
    var monde = profil.mondes[Core.monde];
    
    e.originalEvent.dataTransfer.effectAllowed = 'move';
    e.originalEvent.dataTransfer.setData('text/html', $(this).attr("data-position"));
    
    $("#liste li").addClass("hovering");
    
    var li = $("<li></li>")
        .addClass("ghost-first")
        .addClass("ghost-champ")
        .addClass("ghost")
        .attr({ 
            "data-type": "champ",
            "data-champ": monde.cascade[0],
            "data-pk": "new"
        })
        .text("Nuevo " + monde.champs[monde.cascade[0]].label)
        .on("dragenter", dragenter)
        .on("dragover", dragover)
        .on("dragleave", dragleave);
    
    // On ajoute le Nuevo xxx pour le premier champ
    $("#liste>ul").prepend(li);
    li.slideDown();
};

var dragend = function(e) {
    $(this).fadeTo("fast", 1);
    /*$(".ghost").slideUp({ complete: function() {
        $(".ghost").remove();
    }});
    $(".ghost-word").remove();
    $(".over").removeClass("over");*/
    $("#liste li").removeClass("hovering");
};

var dragover = function(e) {
    e.preventDefault(); 

    e.originalEvent.dataTransfer.dropEffect = 'move';
};

var dragenter = function(e) {
    var li = $(this);
    var ul = li.next("ul");
    var monde = profil.mondes[Core.monde];
    
    li.addClass("over");
    
    clearTimeout(Drag.timeout);
    
    // On introduit un delay pour éviter que ça danse trop
    Drag.timeout = setTimeout( function() {
        // Selon l'élément sur lequel on dragge
        switch(li.attr("data-type")) {
            case "champ":
                var champ = monde.champs[monde.cascade[li.attr("data-niveau")]];
                // On ferme tous les autres champs
                li.closest("ul").children("li").find('div[data-state="open"]').not(li.find("div")).click();
                li.closest("ul").find('li[data-type="document"]').slideUp();
                
                ul.find('div[data-state="open"]').click();
                
                
                $(".ghost").not(".ghost-first").remove();
                $(".ghost-word").remove();
                $("ul[data-ghost]").removeAttr("data-ghost");
                
                // On ouvre le champ 
                if (li.attr("data-state") == "closed") {
                    li.find("div").eq(0).click();
                }
                
                var new_li;
                var new_ul;
                
                /////////////////////////
                // On détache tous les sous-éléments
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
                            new_li = $("<li></li>")
                            .addClass("ghost-type")
                            .addClass("ghost")
                            .attr({
                                "data-type": "type",
                                "data-type-doc": i
                            })
                            .text("Nuevo " + type.label) // LOCALISATION
                            .on("dragenter", dragenter)
                            .on("dragover", dragover)
                            .on("dragleave", dragleave);
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
                });
                
                // - Catégories + types
                $.each(champ.categories, function(i, categorie) {
                    if (categories[i] === undefined) {
                            new_li = $("<li></li>")
                            .addClass("ghost-categorie")
                            .addClass("ghost")
                            .attr({
                                "data-type": "categorie",
                                "data-categorie": i
                            })
                            .append(
                                $("<div></div>")
                                .attr({
                                    "data-type": "categorie",
                                    "data-state": "open"
                                })
                                .addClass("imgboutons")
                            )
                            .append(categorie.label)
                            .on("dragenter", dragenter)
                            .on("dragover", dragover)
                            .on("dragleave", dragleave);
                            
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
                            li_type = $("<li></li>")
                                .attr({
                                    "data-type": "type",
                                    "data-type-doc": j
                                })
                                .addClass("ghost-type")
                                .addClass("ghost")
                                .text("Nuevo " + type.label) // LOCALISATION
                                .on("dragenter", dragenter)
                                .on("dragover", dragover)
                                .on("dragleave", dragleave);
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
                });
                
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
