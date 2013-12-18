
var Core = {
    monde: 0,
    champs: {},
    recherche: [],
    limit: [0, 100],
    liste: [],
    dates: [],
    users: []
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
            .text(monde.label)
            .click(change_monde)
        );
    });
    
    $("#mondes-top li").eq(0).click();
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
        });
        
        select.append(optgroup);
    });
    
    if ($("#search").next("div").hasClass("chosen-container")) {
        $("#search").trigger("chosen:updated");
    } else {
        $("#search").chosen({
            skip_no_results: true,
            width: "30%",
            inherit_select_classes: true,
            placeholder_text_multiple: "Buscar en este mundo...",
            search_contains: true
        });
        
        $("#search").next("div").find('.search-field input[type="text"]').css({
            height: "40px"
        });
        
        $("#search").on("chosen:showing_dropdown", large_search);
        $("#search").change(small_search);
    }
        
};

var large_search = function() {
    var select = $("#search");
    var search = select.next("div");
    var espace;
    
    if (select.attr("data-state") == "closed") {
        espace = $("#toggle-date").offset().left - ($('#mondes-top li:last-child').offset().left + $('#mondes-top li:last-child').outerWidth()) - 10;
        
        search.animate({
            width: search.outerWidth() + espace 
        });
        
        select.attr("data-state", "open");
    }
        
}

var small_search = function() {
    var select = $("#search");
    var search = select.next("div");
    
    if (select.val() == null && select.attr("data-state") == "open") {
        search.animate({
            width: "30%" 
        })
        select.attr("data-state", "closed");
    }
};

var change_monde = function() {
    var ul = $(this).closest("ul");
    var li = $(this).closest("li");
    
    ul.find("li").attr("data-selected", "0");
    
    li.attr("data-selected", "1");
    
    Core.monde = li.attr("data-monde");
    
    Core.champs.length = 0;
    Core.recherche.length = 0;
    
    $.ajax({
        url: "json/dates.php",
        type: "POST",
        data: {
            monde: Core.monde
        },
        statusCode: {
            200: function(dates) {
                var t_mini = dates.mini.split("-");
                var t_maxi = dates.maxi.split("-");
                
                var mini = new Date(t_mini[0], t_mini[1] - 1, t_mini[2]);
                var maxi = new Date(t_maxi[0], t_maxi[1] - 1, t_maxi[2]);
                
                var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

                var diff = Math.round(Math.abs((mini.getTime() - maxi.getTime())/(oneDay)));
                
                Core.dates.length = 0;
                
                if (diff == 0) {
                    Core.dates.push(mini.getTime());
                    slider_maxi = 0;
                } else {
                    for (var i = 0; i < diff;i++) {
                        Core.dates.push(mini.getTime() + (oneDay * i));
                    }
                    slider_maxi = diff - 1;
                }
                
                
                $("#slider-date").slider({
                    "min": 0,
                    "max": slider_maxi,
                    range: true,
                    animate: "fast",
                    slide: change_dates,
                    change: charge_documents
                });
                
                $("#slider-date").slider("values", 1, slider_maxi);
                change_dates();
    
                load_search();
                charge_documents();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de recuperacion de datos. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
};

var change_dates = function() {    
    var bornes = $("#slider-date").slider("values");
                        
    var d_min = new Date(Core.dates[bornes[0]]);
    var d_max = new Date(Core.dates[bornes[1]]);
    
    var jour_min = d_min.getDate().toString();
    var jour_max = d_max.getDate().toString();
    
    if (jour_min.length == 1) {
        jour_min = "0" + jour_min;
    }
    
    if (jour_max.length == 1) {
        jour_max = "0" + jour_max;
    }
    
    var mois_min = (d_min.getMonth() + 1).toString();
    var mois_max = (d_max.getMonth() + 1).toString();
    
    if (mois_min.length == 1) {
        mois_min = "0" + mois_min;
    }
    
    if (mois_max.length == 1) {
        mois_max = "0" + mois_max;
    }
    
    var s_min = jour_min + "/" + mois_min + "/" + d_min.getFullYear();
    var s_max = jour_max + "/" + mois_max + "/" + d_max.getFullYear();
    
    $("#text-date").text("Del " + s_min + " al " + s_max); // LOCALISATION
};

var charge_documents = function() {  
    var dates = {
        // Unixtime est en secondes, JStime est en milisecondes
        mini: Core.dates[$("#slider-date").slider("values")[0]] / 1000,
        maxi: Core.dates[$("#slider-date").slider("values")[1]] / 1000
    };
    
    $.ajax({
        url: "json/search.php",
        type: "POST",
        data: {
            monde: Core.monde,
            recherche: Core.recherche,
            champs: profil.mondes[Core.monde].cascade,
            tri: $("#switch-sort select").val(),
            limit: Core.limit,
            dates: dates
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
                                    .css("margin-left", li.css("margin-left"))
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
                $(this).remove();
//                (li.closest("ul").find('li[data-type="revision"]').remove());
            }
        });
    }
};

var toggle_line = function() {
    var li = $(this);
    var state = li.attr("data-state");
    
    if (state == "closed") {
        state = "open";
        li.next("ul").slideDown("fast");
    } else {
        state = "closed";
        li.next("ul").slideUp("fast");
//        li.next("ul").find("li").slideUp("fast");
//        li.next("ul").find("li[data-state]")
//            .attr("data-state", state)
//            .find("div").attr("data-state", state);
//        li.next("ul").find('li[data-type="revision"]').remove();
    }
    
    li.attr("data-state", state);
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
                    .click(toggle_line)
                    .append(
                        $("<span></span>")
                        .addClass("champ")
                        .text(monde.champs[cascade[stack_champs.length - 1]].liste[ligne.pk])
                    );
                
                ul_champ = $("<ul></ul>")
                            .attr({
                                "data-stack": stack_champs,
                                "data-niveau": ligne.niveau
                            });
                
                current_ul.append(li.css("margin-left", marge + "%"));
                current_ul.append(ul_champ.css("margin-left", marge + "%"));
                
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
                    .click(toggle_line)
                    .append(
                        $("<span></span>")
                        .addClass("categorie")
                        .text(champ_parent.categories[ligne.pk].label)
                    )
                    
                ;
                ul_categorie = $("<ul></ul>")
                            .attr({
                                "data-stack": stack_champs,
                                "data-type": "categorie"
                            });
                
                current_ul.append(li.css("margin-left", marge + "%"));
                current_ul.append(ul_categorie.css("margin-left", marge + "%"));
                
                current_ul = ul_categorie;
                current_level = cascade.length;
                break;
                
            default: // C'est donc un document
                    var champ_parent = monde.champs[cascade[stack_champs.length - 1]];
                    var type, img;
                    
                    if (categorie == 0) {
                        type = champ_parent.types[ligne.type].label;
                        marge = stack_champs.length * 2;
                    } else {
                        type = champ_parent.categories[categorie].types[ligne.type].label;
                        marge = stack_champs.length * 2 + 2;
                    }
                    
                    if (ligne.revision > 1) {
                        img = $("<img></img>")
                            .attr({
                                src: "img/revision_15.png",
                                title: "Existan " + (ligne.revision - 1) + " revisiones anteriores de este documento.",
                                "data-state": "closed"
                            })
                            .addClass("imgboutons")
                            .click(affiche_revisions)
                    } else {
                        img = "";
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
                        ).append(img)
                    );
                    current_ul.append(li.css("margin-left", marge + "%"));
        }
    });
    
    $("#liste").empty().append(ul)
    .find('li[data-type!="categorie"]').on("dragenter", dragenter)
    .on("dragover", dragover)
    .on("dragleave", dragleave)
    .on("drop", drop);
};

