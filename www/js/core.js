

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
        $("#search").on("chosen:hiding_dropdown", small_search);
        $("#search").change(small_search);
    }
        
};

var large_search = function() {
    var select = $("#search");
    var search = select.next("div");
    var espace;
    
    if ($("#container-dates").is(":visible")) {
        $("#toggle-date").click();
    }
    
    if (select.attr("data-state") == "closed") {
        espace = $("#toggle-date").offset().left - ($('#mondes-top li:last-child').offset().left + $('#mondes-top li:last-child').outerWidth()) - 10;
        
        search.animate({
            width: search.outerWidth() + espace 
        }, {
            duration: 100
        });
        
        select.attr("data-state", "open");
    }
        
}

var small_search = function() {
    var select = $("#search");
    var search = select.next("div");
    
    if ($("#container-dates").is(":visible")) {
        $("#toggle-date").click();
    }
    
    if (select.val() == null && select.attr("data-state") == "open") {
        search.animate({
            width: "30%" 
        }, {
            duration: 100
        })
        select.attr("data-state", "closed");
    }
};

var change_monde = function() {
    var ul = $(this).closest("ul");
    var li = $(this).closest("li");
    
    $("#profil").fadeOut();
    $("#mondes").fadeOut();
    $("#designer").fadeOut();
    
    ul.find("li").attr("data-selected", "0");
    
    li.attr("data-selected", "1");
    
    Core.monde = li.attr("data-monde");
    
    Core.champs.length = 0;
    Core.recherche.length = 0;
    
    $("#bouton-admin-liste").attr("title", "Lista de los " + profil.mondes[Core.monde].champs[profil.mondes[Core.monde].cascade[0]].pluriel);
    
    $("#bouton-admin-liste").attr("data-selected", 0);
    $("#bouton-admin-profil").attr("data-selected", 0);
    
    charge_dates();
};

var charge_dates = function() {
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
                    for (var i = 0; i <= diff;i++) {
                        Core.dates.push(mini.getTime() + (oneDay * i));
                    }
                    slider_maxi = diff;
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
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de recuperacion de datos. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
}

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

    var oneDay = 24*60*60*1000;
    
    var dates = {
        // Unixtime est en secondes, JStime est en milisecondes
        mini: Core.dates[$("#slider-date").slider("values")[0]] / 1000,
        maxi: ((Core.dates[$("#slider-date").slider("values")[1]] + oneDay) / 1000) - 1
    };
    
    $.ajax({
        url: "json/search.php",
        type: "POST",
        data: {
            monde: Core.monde,
            recherche: Core.recherche,
            champ_droits: profil.mondes[Core.monde].cascade[0],
            limit: Core.limit,
            dates: dates,
            all: profil.mondes[Core.monde].all,
            droits: profil.mondes[Core.monde].champs[profil.mondes[Core.monde].cascade[0]].liste
        },
        statusCode: {
            200: function(liste) {
                Core.liste = liste;
                construit_table();
                $("#liste").slideDown();
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
    $("#container-viewer-global").fadeOut();
    
    $("#viewer-global").attr({
        "data-document": "none",
        src: ""
    });
};

var affiche_document = function() {
    var span = $(this);
    var li = span.closest("li");
    var filename = li.attr("data-filename");
    var display = li.attr("data-display");
    var extension = filename.split(".").pop().toLowerCase();
    var download = "&download";
    
    if (extension in img_extensions) {
        download = "";
    }
    
    if (extension in pdf_extensions) {
        download = "";
    }
    
    $("#viewer-global").attr({
        "data-document": li.attr("data-position"),
        src: "modules/viewer.php?document=" + filename + "&display=" + encodeURIComponent(display) + download
    });
    
    if (download == "") {
        $("#container-viewer-global").fadeIn();
        
        $("#opak")
        .fadeIn()
        .unbind().click(cancel_view);
    }
    
    if (Tuto.etape == 7) {
        Tuto.next();
    }
};

var affiche_revisions = function() {
    var img = $(this);
    var li = img.closest("li");
    var filename = li.attr("data-filename");
    var categorie = li.attr("data-categorie");
    var type = li.attr("data-type-doc");
    var detail = li.attr("data-detail");
    var champ = profil.mondes[Core.monde].cascade[li.attr("data-niveau")];
    var time = li.attr("data-time");
    
    if (img.attr("data-state") == "closed") {
        $.ajax({
            url: "json/revisions.php",
            type: "POST",
            data: {
                monde: Core.monde,
                champ: champ,
                filename: filename,
                time: time,
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
                                        "data-display": revision.display,
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
    var stack_ul = [ul];
    var current_level = 0;
    
    $.each(Core.liste, function(i, ligne) {
        //console.log(ligne);
        
        switch(ligne.type) {
            case "champ":
                current_ul = stack_ul[ligne.niveau];
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
                
                stack_ul[ligne.niveau + 1] = ul_champ;
                stack_ul.length = ligne.niveau + 2;
                current_level = ligne.niveau;
                break;
                
            case "categorie":
                current_ul = stack_ul[ligne.niveau];
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
                    );
                ul_categorie = $("<ul></ul>")
                            .attr({
                                "data-stack": stack_champs,
                                "data-type": "categorie"
                            });
                
                current_ul.append(li.css("margin-left", marge + "%"));
                current_ul.append(ul_categorie.css("margin-left", marge + "%"));
                
                stack_ul[ligne.niveau + 1] = ul_categorie;
                stack_ul.length = ligne.niveau + 2;
                current_level = ligne.niveau;
                break;
                
            case "an":
                current_ul = stack_ul[stack_champs.length];
                var ul_an = $("<ul></ul>")
                            .attr({
                                "data-stack": stack_champs,
                                "data-niveau": stack_champs.length,
                                "data-type": "an"
                            });
                
                marge = (stack_champs.length) * 2;
                            
                li = $("<li></li>")
                    .attr({
                        "data-type": "champ",
                        "data-an": ligne.an,
                        "data-stack": stack_champs,
                        "data-niveau": stack_champs.length,
                        "data-state": "closed"
                    })
                    .click(toggle_line)
                    .append(
                        $("<span></span>")
                        .addClass("champ")
                        .text(ligne.an)
                    );
                    
                current_ul.append(li.css("margin-left", marge + "%"));
                current_ul.append(ul_an.css("margin-left", marge + "%"));
                
                stack_ul[stack_champs.length + 1] = ul_an;
                categorie = 0;
                break;
                
            case "mois":
                current_ul = stack_ul[stack_champs.length + 1];
                var ul_mois = $("<ul></ul>")
                            .attr({
                                "data-stack": stack_champs,
                                "data-niveau": stack_champs.length + 1,
                                "data-type": "mois"
                            });
                
                marge = (stack_champs.length + 1) * 2;
                            
                li = $("<li></li>")
                    .attr({
                        "data-type": "champ",
                        "data-mois": ligne.mois,
                        "data-stack": stack_champs,
                        "data-niveau": stack_champs.length + 1,
                        "data-state": "closed"
                    })
                    .click(toggle_line)
                    .append(
                        $("<span></span>")
                        .addClass("champ")
                        .text(ligne.mois + " - " + mois[ligne.mois])
                    );
                    
                current_ul.append(li.css("margin-left", marge + "%"));
                current_ul.append(ul_mois.css("margin-left", marge + "%"));
                
                stack_ul[stack_champs.length + 2] = ul_mois;
                stack_ul.length = stack_champs.length + 3;
                categorie = 0;
                break;
                    
            default: // C'est donc un document
                    current_ul = stack_ul[stack_ul.length - 1]; 
                    var champ_parent = monde.champs[cascade[stack_champs.length - 1]];
                    var type, img_revisions, img_del;
                    var extension = ligne.filename.split(".").pop().toLowerCase();
                    var time;
                    
                    if (categorie == 0) {
                        type = champ_parent.types[ligne.type].label;
                        time = champ_parent.types[ligne.type].time;
                        marge = stack_champs.length * 2;
                    } else {
                        type = champ_parent.categories[categorie].types[ligne.type].label;
                        time = champ_parent.categories[categorie].types[ligne.type].time;
                        marge = stack_champs.length * 2 + 2;
                    }
                    
                    if (ligne.revision > 1 && profil.niveau > 0) {
                        img_revisions = $("<img></img>")
                            .attr({
                                src: "img/revision_15.png",
                                title: "Existan " + (ligne.revision - 1) + " revisiones anteriores de este documento.",
                                "data-state": "closed"
                            })
                            .addClass("imgboutons")
                            .click(affiche_revisions)
                    } else {
                        img_revisions = "";
                    }
                    
                    if (profil.niveau >= 10) {
                        img_del = $("<img></img>")
                        .attr({
                            src: "img/del_15.png",
                            title: "Declasificar documento"
                        })
                        .addClass("imgboutons")
                        .click(del_document)
                    } else {
                        img_del = "";
                    }
                    
                    var filetype = "";
    
                    if (extension in pdf_extensions) {
                        filetype = "pdf";
                    }
                    
                    if (extension in doc_extensions) {
                        filetype = "doc";
                    }
                    
                    if (extension in img_extensions) {
                        filetype = "img";
                    }
                    
                    if (extension in vid_extensions) {
                        filetype = "vid";
                    }
                    
                    if (type == "") {
                        filetype ="xxx";
                    }                    
                    
                    if (time == 1) {
                        time = ligne.date.split("/")[2] + ligne.date.split("/")[1];
                    } else {
                        time = "000000";
                    }
                    
                    li = $("<li></li>")
                    .attr({
                        "data-type": "document",
                        "data-stack": stack_champs,
                        "data-filename": ligne.filename,
                        "data-time": time,
                        "data-filetype": filetype,
                        "data-display": ligne.display,
                        "data-categorie": categorie,
                        "data-type-doc": ligne.type,
                        "data-detail": ligne.detail,
                        "data-niveau": stack_champs.length - 1
                    })
                    .append(img_del)
                    .append(img_revisions)
                    .append(
                        $("<span></span>")
                        .addClass("document")
                        .text(type + " " + ligne.detail)
                        .click(affiche_document)
                        .append(
                            $("<i></i>")
                            .text(" (" + ligne.date + ")")
                        )
                    );
                    current_ul.append(li.css("margin-left", marge + "%"));
        }
    });
    
    $("#liste").empty().append(ul)
    .find('li[data-type!="categorie"]').on("dragenter", dragenter)
    .on("dragover", dragover)
    .on("dragleave", dragleave)
    .on("drop", drop);
    
    $("#container-icones-admin").animate({
        left: $('#mondes-top li[data-monde="' + Core.monde + '"]').offset().left + "px"
    });
};

var del_document = function() {
    var img = $(this);
    var li = img.closest("li");
    var filename = li.attr("data-filename");

    var message = "Este documento esta a punto de ser declasificado.<br/><b>No sera borrado del sistema!</b><br/>Lo encontraras en tu <b>fila de espera</b>, donde podras borrarlo definitivamente o clasificarlo otra vez.<br/>Si existe una revision mas antigua de este documento, esta version sera restaurada.";
    
    var title = "Declasificacion de documento"; 
    
    var bouton = "Confirmar (<i>Declasificar documento</i>)";

    var callback = function() {
        $.ajax({
            url: "do/doRequeueDocument.php",
            type: "POST",
            data: {
                filename: filename
            },
            statusCode : {
                200: function() {
                    popup("El documento fue declasificado con exito!", "confirmation");
                    get_queue();
                    charge_documents();
                },
                403: function() {
                    window.location.replace("index.php");
                },
                500: function() {
                    popup("Error! Gracias por intentar otra vez...", "error");
                }
            }
        });
    };
    
    popup_confirmation(message, title, bouton, callback);
};

