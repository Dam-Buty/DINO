
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
    $(".ghost").slideUp({ complete: function() {
        $(".ghost").remove();
    }});
    $(".ghost-word").remove();
    $(".over").removeClass("over");
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
                ul.find('div[data-state="open"]').click();
                
                $(".ghost").not(".ghost-first").remove();
                $(".ghost-word").remove();
                
                // On ouvre le champ 
                if (li.attr("data-state") == "closed") {
                    li.find("div").eq(0).click();
                }
                
                /////////////////////////
                // Types
                // - On détache les lignes existantes
                var types = {};
                $.each(ul.find('li[data-type="document"]'), function(i, document) {
                    types[$(document).attr("data-type-doc")] = document;
                    $(document).detach();
                });
                
                // - On ghoste les lignes qui n'existent pas, on repose les autres
                $.each(champ.types, function(i, type) {
                    if (types[i] === undefined) {
                            var new_li = $("<li></li>")
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
                            ul.append(new_li);
                    } else {
                        $(types[i]).find("div").prepend(
                            $("<span></span>")
                            .addClass("ghost-word")
                            .text("Replazar ") // LOCALISATION
                        )
                        ul.append(types[i]);
                    }   
                });
                
                ul.children("li").slideDown();
                break;
        };
    }, Drag.delay);

    return false;
};

var dragleave = function(e) {
    var li = $(this);
    
    li.removeClass("over");
};
