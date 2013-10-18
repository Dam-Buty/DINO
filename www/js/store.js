

var types_detail = [];

// On va déterminer le premier champ non rempli
// Et afficher dans le li correspondant
// Le formulaire correspondant (i know, rite?)
var next_field = function(position) {
    var select, input;
    var element = queue[position];
    var store = element.store;
    
    // S'il n'y a qu'un monde on l'affecte automatiquement
    if (profil.mondes.length == 1) {
        store.monde = 0;
    }
    
    if (store.monde === "") {
        // On fait choisir un monde
        select = $("<select></select>");
        
        $.each(profil.mondes, function() {
            select.append(
                $("<option></option>")
                .attr("value", this.pk)
                .text(this.label)
            );
        });
        element.li.find("div").attr("data-page", "monde");
        element.li.find("p").empty().text("Mundo : ").append(select);
        
    } else {
        if (profil.mondes[store.monde].cyclique && store.operation == "") {
            // On demande le numéro d'opération
            input = $("<input></input>").autocomplete({
                source: profil.mondes[store.monde].references
            });
            
            element.li.find("div").attr("data-page", "reference");
            element.li.find("p").empty().text("Referencia de operacion : ").append(input);
        } else {
            var prochain_champ = "";
            
            // On vérifie si on vient de changer de monde ou pas
            if (store.champs.monde != store.monde) {
                // On vient de changer de monde donc on refait
                // le tableau des champs et on part sur le premier
                store.champs.liste.length = 0;
                
                $.each(profil.mondes[store.monde].champs, function() {
                    store.champs.liste.push("");
                });
                
                // on note qu'il n'y a plus à créer le tableau de champs
                store.champs.monde = store.monde;
                
                prochain_champ = 0;
            } else {
                // On parcourt pour voir si il y a des champs à renseigner
                $.each(profil.mondes[store.monde].champs, function(i, champ) {
                    if (store.champs.liste[i] == "") {
                        prochain_champ = i;
                        return false
                    }
                });
            }
            
            if (prochain_champ !== "") {
                // Il y a un champ à renseigner, on le demande
                select = $("<select></select>");
                
                $.each(profil.mondes[store.monde].champs[prochain_champ].liste, function() {
                    select.append(
                        $("<option></option>")
                        .attr("value", this.pk)
                        .text(this.label)
                    );
                });
                
                element.li.find("div").attr("data-page", "champ-" + prochain_champ);
                element.li.find("p").empty().text(profil.mondes[store.monde].champs[prochain_champ].label + " : ").append(select);
            } else {
                if (store.categorie === "") {
                    // On demande la catégorie
                    select = $("<select></select>");
                    
                    $.each(profil.mondes[store.monde].categories, function() {
                        select.append(
                            $("<option></option>")
                            .attr("value", this.pk)
                            .text(this.label)
                        );
                    });
                    
                    element.li.find("div").attr("data-page", "categorie");
                    element.li.find("p").empty().text("Categoria de documento : ").append(select);
                } else {
                    if (store.type_doc.pk === "") {
                        types_detail.length = 0;
                        detail_first = 9999;
                        
                        // On demande le type de doc
                        select = $("<select></select>");
                        
                        $.each(profil.mondes[store.monde].categories[store.categorie].types, function(i, type) {
                            select.append(
                                $("<option></option>")
                                .attr("value", type.pk)
                                .text(type.label)
                            );
                            
                            if (this.detail) {
                                types_detail.push(type.pk);
                                if (i < detail_first) {
                                    detail_first = i;
                                }
                            }
                        });
                        
                        input = $("<input></input>");
                        
                        // Si le premier type à détail n'est pas le 0,
                        // On disable l'input (parceque l'élément sélectionné
                        // par défaut dans le select est le 0)
                        if (detail_first > 0) {
                            input.attr("disabled", "disabled");
                        }
                        
                        // *TODO* Intégrer le champ détail dynamique
                        select.change(function() { console.log(this) });
                        
                        element.li.find("div").attr("data-page", "type");
                        element.li.find("p").empty().text("Typo de documento : ").append(select);
                    } else {
                        // Classification terminée, on supprime le document de la queue
                        queue.splice(position, 1);
                        refresh_liste();
                    }
                }
            }
        }
    }
    
    var page = element.li.find("div").attr("data-page");
    
    // Inhiber les boutons prev et next s'il n'y a pas de raison d'aller avant ou après
    if (page == "monde" || ( profil.mondes.length == 1 && (page == "reference" || (page == "champ-0" && profil.mondes[element.store.monde].cyclique == 0)))) {
        
        element.li.find("div").find("img").eq(0)
            .attr("src", "img/prev_no.png")
            .unbind();
    } else {
        element.li.find("div").find("img").eq(0)
            .attr("src", "img/prev.png")
            .unbind()
            .click(previous_page);
    }
    
    if (page == "type") {
        element.li.find("div").find("img").eq(1)
            .attr("src", "img/next_no.png")
            .unbind();
    } else {
        element.li.find("div").find("img").eq(1)
            .attr("src", "img/next.png")
            .unbind()
            .click(next_page);
    }
    
};

var previous_page = function() {    
    var li = $(this).closest("li");
    var element = queue[li.attr("data-position")];
    var page = li.find("div").attr("data-page");
    var page_delete = "";
    
    switch(page.split("-")[0]) {                    
        case "reference": 
            page_delete = "monde";
            break;
            
        case "champ":
            var num_champ = page.split("-")[1];
            
            if (num_champ == 0) {
                if (profil.mondes[element.store.monde].cyclique == 1) {
                    page_delete == "reference";
                } else {
                    page_delete = "monde";
                }
            } else {
                page_delete = "champ-" + (num_champ - 1);
            }
            
            break;
            
        case "categorie":
            page_delete = "champ-" + (element.store.champs.liste.length - 1);
            break;
            
        case "type":
            page_delete = "categorie";
            break;
    }
    
    $.ajax({
        url: "do/doStore.php",
        type: "POST", 
        data: {
            action: "remove",
            filename: element.filename,
            page: page_delete
        },
        statusCode: {
            200: function() {
                switch(page_delete.split("-")[0]) { 
                    case "monde":
                        element.store.monde = "";
                        break;
                        
                    case "reference":
                        element.store.reference = "";
                        break;
                        
                    case "champ":
                        element.store.champs.liste[page_delete.split("-")[1]] = "";
                        break;
                        
                    case "categorie":
                        element.store.categorie = "";
                        break;
                }
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                new $.Zebra_Dialog(
                    'Error de supresion de datos. Gracias por intentar otra vez', {
                    'type': 'error',
                    'buttons':  false,
                    'modal': false,
                    'width': Math.floor($(window).width() * 0.3),
                    'position': ['right - 20', 'top + 20'],
                    'auto_close': 3000
                });
            }
        }
    });
    
    next_field(li.attr("data-position"));
};

var next_page = function() {
    var li = $(this).closest("li");
    var element = queue[li.attr("data-position")];
    var page = li.find("div").attr("data-page");
    var select = li.find("select").val();
    var input = li.find("input").val();
    var isnew = 1;
    var num_champ, pk_champ, cyclique;
    var monde = "";
    var reference = "";
    
    if (page != "monde") {
        cyclique = profil.mondes[element.store.monde].cyclique;
    } else {
        cyclique = 0;
    }
    
    switch(page.split("-")[0]) {
        case "reference":
            $.each(profil.mondes[element.store.monde].references, function() {
                if (input == this) {
                    isnew = 0;
                }
            });
            
            break;
            
        case "champ":
            num_champ = page.split("-")[1];
            pk_champ = profil.mondes[element.store.monde].champs[num_champ].pk;
            
            break;
    }
    
    $.ajax({
        url: "do/doStore.php",
        type: "POST", 
        data: {
            action: "add",
            filename: element.filename,
            page: page.split("-")[0],
            monde: monde,
            cyclique: cyclique,
            reference: element.store.reference,
            categorie: element.store.categorie,
            new_ope: isnew,
            pk_champ: pk_champ,
            valeur_select: select,
            valeur_input: input
        },
        statusCode: {
            200: function(champs) {
                switch(page.split("-")[0]) {
                    case "monde":
                        element.store.monde = select;
                        break;
                    
                    case "reference": 
                        element.store.reference = input;
                        
                        // Si ce n'est pas une nouvelle opé,
                        // on rappatrie les champs de l'opé
                        // depuis le JSON retourné
                        if (!isnew) {
                            $.each(champs, function(i, valeur) {
                                $.each(profil.mondes[element.store.monde].champs, function(j, champ) {
                                    if (champ.pk == valeur.pk) {
                                        element.store.champs.liste[j] = valeur.valeur;
                                        return false;
                                    }
                                });
                            });
                        }
                        break;
                        
                    case "champ":
                        element.store.champs.liste[num_champ] = select;
                        break;
                        
                    case "categorie":
                        element.store.categorie = select;
                        break;
                        
                    case "type":
                        element.store.type.pk = select;
                        element.store.type.detail = input;
                }
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                new $.Zebra_Dialog(
                    'Error de guardado de datos. Gracias por intentar otra vez', {
                    'type': 'error',
                    'buttons':  false,
                    'modal': false,
                    'width': Math.floor($(window).width() * 0.3),
                    'position': ['right - 20', 'top + 20'],
                    'auto_close': 3000
                });
            }
        }
    });
    
    next_field(li.attr("data-position"));
};

var store_document = function() {    
    // On referme les autres
    $(this).closest("ul").find("div").hide("slow");
    
    // On passe au premier champ disponible
    next_field($(this).closest("li").attr("data-position"));
    
    $(this).closest("li").find("div").show("slow");
    $(this).closest("li")
    .find("div")
    .find("img")
        .eq(0).unbind().click(previous_page).end()
        .eq(1).unbind().click(next_page);
    
    console.log($(this).closest("li").find("div").find("img"));
};

