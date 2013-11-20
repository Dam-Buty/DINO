
var Core = {
    monde: 0,
    champs: {},
    recherche: [],
    limit: [0, 100],
    liste: []
};

var bootstrap_list = function() {
    // Peuple la liste des mondes    
    $.each(profil.mondes, function(i, monde) {
        $("#mondes-top").append(
            $("<li></li>")
            .attr({
                "data-monde": i,
                "data-selected": 0
            })
            .append(
                $("<h1></h1>")
                .text(monde.label)
                .click(change_monde)
            )
        );
    });
    
    $("#mondes-top").find("h1").eq(0).click();
};

var load_search = function() {
    var select = $("#search").empty();
    
    $.each(profil.mondes[Core.monde].cascade, function(i, pk) {
        var champ = profil.mondes[Core.monde].champs[pk];
        var optgroup = $("<optgroup></optgroup>")
                        .attr({
                            "data-type": "champ",
                            "data-pk": pk,
                            label: champ.pluriel
                        });
                        
        $.each(champ.liste, function(j, valeur) {
            optgroup.append(
                $("<option></option>")
                .attr({
                    "data-champ": pk,
                    "data-pk": j
                })
                .text(valeur)
            );
        })
        
        select.append(optgroup);
    });
    
    select.trigger("chosen:updated");
    
    $(".chosen-container-multi").animate({
        width: ($("#core-top").innerWidth() - $("#mondes-top").outerWidth() - $("#list-sort").outerWidth() - 40) + "px",
        left: ($("#mondes-top").offset().left + $("#mondes-top").outerWidth() + 20) + "px"
    });
    
    $(".search-field input").animate({
        width: "100%"
    });
};

var change_monde = function() {
    var ul = $(this).closest("ul");
    var li = $(this).closest("li");
    
    ul.find("li").attr("data-selected", "0");
    
    li.attr("data-selected", "1");
    
    Core.monde = li.attr("data-monde");
    
    $("#search").css({"width": "100px" });
    
    Core.champs.length = 0;
    
    $("#liste").css("padding-top", ($("#mondes-top").outerHeight() + 20) + "px");
    
    load_search();
    charge_documents();
};

var charge_documents = function() {    
    // On récupère les champs dans l'ordre de la liste
    $.each($("#list-sort li"), function(i, li) {
        var pk_champ = $(li).attr("data-champ");
        var champ = profil.mondes[Core.monde].champs[pk_champ];
        
        champs.push(
            $.extend(Core.champs[pk_champ], { pk: pk_champ })
        );
    });
    
    $.ajax({
        url: "json/search.php",
        type: "POST",
        data: {
            monde: Core.monde,
            recherche: Core.recherche,
            champs: profil.mondes[Core.monde].cascade,
            tri: "ASC",
            limit: Core.limit
        },
        statusCode: {
            200: function(liste) {
                Core.liste = liste;
                construit_table();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de recuperacion de los documentos. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
};

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

var cancel_view = function() {
    $("#opak").fadeOut();
    $("#viewer-global").fadeOut();
};

var affiche_document = function() {
    var span = $(this);
    var li = span.closest("li");
    var filename = li.attr("data-filename");
    
    $("#viewer-global").attr({
        "data-document": li.attr("data-position"),
        src: "pdfjs/viewer/viewer.html?file=" + escape("../../do/doUnpack.php?document=" + filename)
    })
    .fadeIn();
    
    $("#opak")
    .fadeIn()
    .unbind().click(cancel_view);
    $("#viewer-global").fadeIn();
};

var affiche_revisions = function() {
    var img = $(this);
    var li = img.closest("li");
    var filename = li.attr("data-filename");
    var categorie = li.attr("data-categorie");
    var type = li.attr("data-type-doc");
    var detail = li.attr("data-detail");
    var champ = profil.mondes[Core.monde].cascade[li.attr("data-niveau")];
    
    if (img.attr("data-state") == "closed") {
        $.ajax({
            url: "json/revisions.php",
            type: "POST",
            data: {
                monde: Core.monde,
                champ: champ,
                filename: filename,
                categorie: categorie,
                type: type,
                detail: detail
            },
            statusCode: {
                200: function(revisions) {
                    img.attr("data-state", "open");
                    $.each(revisions, function(i, revision) {
                        var new_li = $("<li></li>")
                                    .attr({
                                        "data-filename": revision.filename,
                                        "data-type": "revision"
                                    })
                                    .css("padding-left", li.css("padding-left"))
                                    .append(
                                        $("<span></span>")
                                        .addClass("document")
                                        .text(" > Revision " + revision.revision)
                                        .click(affiche_document)
                                        .append(
                                            $("<i></i>")
                                            .text(" (" + revision.date + ")")
                                        )
                                    );
                        li.after(new_li);
                        new_li.slideDown();
                    });
                },
                403: function() {
                    window.location.replace("index.php");
                },
                500: function() {
                    popup('Error de recuperacion de los documentos. Gracias por intentar otra vez', 'error'); // LOCALISATION
                }
                
            }
        });
    } else {
        img.attr("data-state", "closed");
        li.closest("ul").find('li[data-type="revision"]').slideUp({
            complete: function() {
                (li.closest("ul").find('li[data-type="revision"]').remove());
            }
        });
    }
};

var toggle_line = function() {
    var div = $(this);
    var li = div.closest("li");
    var state = li.attr("data-state");
    var action;
    
    if (state == "closed") {
        state = "open";
        li.next("ul").children("li").slideDown("fast");
    } else {
        state = "closed";
        li.next("ul").find("li").slideUp("fast");
        li.next("ul").find("li[data-state]")
            .attr("data-state", state)
            .find("div").attr("data-state", state);
        li.next("ul").find('li[data-type="revision"]').remove();
    }
    
    li.attr("data-state", state);
    div.attr("data-state", state);
};

var construit_table = function() {
    var monde = profil.mondes[Core.monde];
    var cascade = monde.cascade;
    var stack_champs = [];
    var categorie = 0;
    var marge;
    var ul = $("<ul></ul>");
    var current_ul = ul;
    var current_level = 0;
    
    $.each(Core.liste, function(i, ligne) {
        //console.log(ligne);
        
        if (ligne.type == "champ" || ligne.type == "categorie") {
            if (ligne.niveau == 0) {
                current_ul = ul;
            } else {
                for (var i = 0; i < current_level - ligne.niveau + 1;i++) {
                    current_ul = current_ul.parent();
                }
            }
        }
        
        switch(ligne.type) {
            case "champ":
                stack_champs.splice(ligne.niveau);
                stack_champs.push(ligne.pk);
                categorie = 0;
                marge = ligne.niveau * 2;
                
                li = $("<li></li>")
                    .attr({
                        "data-type": ligne.type,
                        "data-pk": ligne.pk,
                        "data-niveau": ligne.niveau,
                        "data-stack": stack_champs,
                        "data-state": "closed"
                    })
                    .append(
                        $("<div></div>")
                        .attr({
                            "data-type": ligne.type,
                            "data-state": "closed"
                        })
                        .addClass("imgboutons")
                        .click(toggle_line)
                    ).append(
                        $("<span></span>")
                        .addClass("champ")
                        .text(monde.champs[cascade[stack_champs.length - 1]].liste[ligne.pk])
                    );
                
                ul_champ = $("<ul></ul>")
                            .attr("data-stack", stack_champs);
                
                current_ul.append(li.css("padding-left", marge + "%"));
                current_ul.append(ul_champ);
                
                current_ul = ul_champ;
                current_level = ligne.niveau;
                break;
                
            case "categorie":
                categorie = ligne.pk;
                var champ_parent = monde.champs[cascade[stack_champs.length - 1]];
                marge = stack_champs.length * 2;
                
                li = $("<li></li>")
                    .attr({
                        "data-type": ligne.type,
                        "data-pk": ligne.pk,
                        "data-stack": stack_champs,
                        "data-state": "closed"
                    })
                    .append(
                        $("<div></div>")
                        .attr({
                            "data-type": ligne.type,
                            "data-state": "closed"
                        })
                        .addClass("imgboutons")
                        .click(toggle_line)
                    ).append(
                        $("<span></span>")
                        .addClass("categorie")
                        .text(champ_parent.categories[ligne.pk].label)
                    )
                    
                ;
                ul_categorie = $("<ul></ul>")
                            .attr("data-stack", stack_champs);
                
                current_ul.append(li.css("padding-left", marge + "%"));
                current_ul.append(ul_categorie);
                
                current_ul = ul_categorie;
                current_level = cascade.length;
                break;
                
            default: // C'est donc un document
                    var champ_parent = monde.champs[cascade[stack_champs.length - 1]];
                    var type, img, title;
                    
                    if (categorie == 0) {
                        type = champ_parent.types[ligne.type].label;
                        marge = stack_champs.length * 2;
                    } else {
                        type = champ_parent.categories[categorie].types[ligne.type].label;
                        marge = stack_champs.length * 2 + 2;
                    }
                    
                    if (ligne.revision > 1) {
                        img = "img/history.png";
                        title = "Existan " + (ligne.revision - 1) + " revisiones anteriores de este documento.";
                    } else {
                        img = "img/history_no.png";
                        title = "No existan revisiones anteriores de este documento.";
                    }
                    
                    li = $("<li></li>")
                    .attr({
                        "data-type": "document",
                        "data-stack": stack_champs,
                        "data-filename": ligne.filename,
                        "data-categorie": categorie,
                        "data-type-doc": ligne.type,
                        "data-detail": ligne.detail,
                        "data-niveau": stack_champs.length - 1
                    })
                    .append(
                        $("<div></div>").append(
                            $("<span></span>")
                            .addClass("document")
                            .text(type + " " + ligne.detail)
                            .click(affiche_document)
                        ).append(
                            $("<i></i>")
                            .text(" (" + ligne.date + ")")
                        ).append(
                            $("<img></img>")
                            .attr({
                                src: img,
                                title: title,
                                "data-state": "closed"
                            })
                            .addClass("imgboutons")
                            .click(affiche_revisions)
                        )
                    );
                    current_ul.append(li.css("padding-left", marge + "%"));
        }
    });
    
    $("#liste").empty().append(ul);
};
