

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
        // On vérifie les masters
        //  - si ils sont pas bons on propose le prochain
        //  - sinon
        //      - Si cyclique et ref ope vide on envoie la ref
        //      - Sinon on envoie les prochains champs non masters
        //      - Puis categorie puis type
        
        var prochain_master = 9999;
        var prochain_champ = 9999;
            
        // On vérifie si on vient de changer de monde ou pas
        if (store.champs.monde !== store.monde) {
            // On vient de changer de monde donc on refait
            // les tableaux de champs et on met prochain_master
            // à 0
            store.champs.master.length = 0;
            store.champs.normal.length = 0;
            
            $.each(profil.mondes[store.monde].champs, function(i, champ) {
                if (champ.master == "1") {
                    store.champs.master.push({ position: i, valeur: "" });
                } else {
                    store.champs.normal.push({ position: i, valeur: "" });
                }
            });
            
            // on note qu'il n'y a plus à créer le tableau de champs
            store.champs.monde = store.monde;
            prochain_master = 0;
        } else {
            // On cherche le prochain master à renseigner
            $.each(store.champs.master, function() {
                if (this.valeur === "") {
                    prochain_master = this.position;
                    return false;
                }
            });
        }
        
        // Tous les masters sont OK, on envoie la référence si elle est pas
        // renseignée
        if (prochain_master == 9999) {
            if (profil.mondes[store.monde].cyclique == 1 && store.operation === "") {
                var liste_master = [];
                
                // On récupère les pk et les valeurs des champs master
                $.each(store.champs.master, function() {
                    liste_master.push({ pk: profil.mondes[store.monde].champs[this.position].pk, valeur: this.valeur });
                });
                
                prochain_champ = 99999;
                
                // On demande le numéro d'opération
                $.ajax({
                    url: "json/references.php",
                    type: "POST",
                    data: {
                        monde: profil.mondes[store.monde].pk,
                        master: liste_master
                    },
                    statusCode: {
                        200: function(references) {
                            var liste_simple = [];
                            var liste_complete = [];
                            
                            // On récupère une liste de références avec leurs
                            // valeurs de champs, mais avec des pk qu'il faut
                            // changer en indices de profil
                            $.each(references, function(i, reference) {
                                liste_simple.push(reference.pk);
                                
                                var ligne = { 
                                    pk: reference.pk,
                                    champs: []
                                }
                                
                                $.each(reference.champs, function(j, champ_reference) {
                                    // pour chaque champ on prend le pk
                                    // et on le cherche dans le profil
                                    // pour trouver son indice
                                    
                                    $.each(profil.mondes[store.monde].champs, function(k, champ_profil) {
                                        if (champ_profil.pk == champ_reference.pk) {
                                            ligne.champs.push({
                                                position: k,
                                                valeur: champ_reference.valeur
                                            });
                                            return false;
                                        }
                                    });
                                      
                                });
                                
                                liste_complete.push(ligne);
                            });   
                            
                            profil.mondes[store.monde].references = { simple: liste_simple, complete: liste_complete };
                        
                            input = $("<input></input>").autocomplete({
                                source: profil.mondes[store.monde].references.simple
                            });
                            element.li.find("div").attr("data-page", "reference");
                            element.li.find("p").empty().text("Referencia de operacion : ").append(input);
                        },
                        403: function() {
                            window.location.replace("index.php");
                        },
                        500: function() {
                            popup('Error de recuperacion de referencias. Gracias por intentar otra vez', 'error'); // LOCALISATION
                        }
                    }
                });
                
            } else {
                $.each(store.champs.normal, function() {
                    if (this.valeur === "") {
                        prochain_champ = this.position;
                        return false;
                    }
                });
            }
        } else {
            prochain_champ = prochain_master;
        }
        
        // Si le prochain élément est un champ (et pas
        // la référence), on envoie le champ
        if (prochain_champ != 99999) {
            if (prochain_champ != 9999) {
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
                // On demande la catégorie et le type
                select = $("<select></select>");
                input = $("<input></input>").attr("disabled", "disabled");
                var optgroup;
                
                $.each(profil.mondes[store.monde].categories, function(i, categorie) {
                    optgroup = $("<optgroup></optgroup>")
                                .attr("label", categorie.label)
                                .attr("data-categorie", i)
                                .text(categorie.label);
                                
                    $.each(categorie.types, function(j, type) {
                        var asterisk = "";
                        
                        if (type.detail == 1) {
                            asterisk = " *";
                        }
                        
                        optgroup.append(
                            $("<option></option>")
                            .attr("value", type.pk)
                            .text(type.label + asterisk)
                        );
                    });
                    
                    select.append(optgroup);
                });
                
                element.li.find("div").attr("data-page", "type");
                element.li.find("p")
                .empty()
                .text("Typo de documento : ")
                .append(select)
                .append("<br/>Detalle : ")
                .append(input)
                .append(
                    $("<img></img>")
                    .attr("src", "img/archiver.png")
                    .unbind()
                    .click(archive_document)
                );
                
                select.change(function() { 
                    var option = $(this.options[this.selectedIndex]);
                    var pk = $(this).val();
                    
                    var categorie = option.closest('optgroup').attr('data-categorie');
                    var position = option.closest('li').attr('data-position');
                    var input = option.closest('li').find('input');
                    var hasdetail = 0;
                    
                    // On retrouve le type en question dans le profil
                    // pour lui demander si il est détaillable
                    $.each(profil.mondes[queue[position].store.monde].categories[categorie].types, function(i, type) {
                        if (type.pk == pk) {
                            if (type.detail == 1) {
                                // On active l'input et on
                                // l'alimente avec la liste des details
                                // existants
                                input.removeAttr("disabled").autocomplete({
                                    source: type.details
                                });
                                hasdetail = 1;
                            }
                            return false;
                        }
                    });
                    
                    if (!hasdetail) {
                        input.attr("disabled", "disabled").val("");
                    }
                });
                
            }
        } // Fin IF
    }
    
    var page = element.li.find("div").attr("data-page");
    
    var button_prev, button_next;
    
    if (page == "type") {
        button_prev = element.li.find("div").find("img").eq(1);
        button_next = element.li.find("div").find("img").eq(2);
        
    } else {
        button_prev = element.li.find("div").find("img").eq(0);
        button_next = element.li.find("div").find("img").eq(1);
    }
    
    // Inhiber les boutons prev et next s'il n'y a pas de raison d'aller avant ou après
    if (page == "monde" || ( profil.mondes.length == 1 && (page == "reference" || (page == "champ-0" && profil.mondes[element.store.monde].cyclique == 0)))) {
        
        button_prev
            .attr("src", "img/prev_no.png")
            .unbind();
    } else {
        button_prev
            .attr("src", "img/prev.png")
            .unbind()
            .click(previous_page);
    }
    if (page == "type") {
        button_next
            .attr("src", "img/next_no.png")
            .unbind();
    } else {
        button_next
            .attr("src", "img/next.png")
            .unbind()
            .click(next_page);
    }
};

var next_page = function() {
    var li = $(this).closest("li");
    var element = queue[li.attr("data-position")];
    var store = element.store;
    var page = li.find("div").attr("data-page");
    var select = li.find("select").val();
    var input = li.find("input").val();
    
    switch(page.split("-")[0]) {
        case "monde":
            $.each(profil.mondes, function(i, monde) {
                if (monde.pk == select) {
                    store.monde = i;
                }
            });
            break;
            
        case "reference":
            store.operation = input;
            
            // Si l'opération existe déjà, on récupère ses champs
            // normaux via le profil
            $.each(profil.mondes[store.monde].references.complete, function() {
                if (this.pk == store.operation) {
                    store.champs.normal = this.champs;
                    return false;
                }
            });
            
            break;
            
        case "champ":
            var num_champ = page.split("-")[1];
            var stored = 0;
            
            $.each(store.champs.master, function(i, master) {
                if (master.position == num_champ) {
                    store.champs.master[i].valeur = select;
                    stored = 1;
                    return false;
                }
            });
            
            if (!stored) {
                $.each(store.champs.normal, function(i, normal) {
                    if (normal.position == num_champ) {
                        store.champs.normal[i].valeur = select;
                        stored = 1;
                        return false;
                    }
                });
            }
            
            break;
    }
    
    next_field(li.attr("data-position"));
};

var previous_page = function() {
    var li = $(this).closest("li");
    var element = queue[li.attr("data-position")];
    var store = element.store;
    var page = li.find("div").attr("data-page");
    
    switch(page.split("-")[0]) {
        case "reference":
            // Si c'est cyclique
            // - on revient au dernier master
            // - sinon on revient au monde
            if (profil.mondes[store.monde].cyclique == 1) {
                store.champs.master[store.champs.master.length - 1].valeur = "";
            } else {
                store.monde = "";
            }
            break;
            
        case "champ":
            var num_champ = page.split("-")[1];
            var deleted = 0;
            
            // Si c'est un master :
            // - si c'est le 0 on efface le monde 
            // - sinon on efface le master avant
            // Sinon
            // - Si c'est le 0
            //   - si cyclique on efface la référence
            //   - sinon on efface le dernier master
            // - Sinon on efface le champ avant
            
            $.each(store.champs.master, function(i, master) {
                if (master.position == num_champ) {
                    if (i == 0) {
                        store.monde = "";
                        deleted = 1;
                    } else {
                        store.champs.master[i - 1].valeur = "";
                        deleted = 1;
                    }
                }
                return !deleted;
            });
            
            
            if (!deleted) {
                $.each(store.champs.normal, function(i, normal) {
                    if (normal.position == num_champ) {
                        if (i == 0) {
                            if (profil.mondes[store.monde].cyclique == 1) {
                                store.operation = "";
                                deleted = 1;
                            } else {
                                store.champs.master[store.champs.master.length - 1].valeur = "";
                                deleted = 1;
                            }
                        } else {
                            store.champs.normal[i - 1].valeur = "";
                            deleted = 1;
                        }
                    }
                    return !deleted;
                });
            }           
            break;
            
        case "type":
            if (store.champs.normal.length > 0) {
                store.champs.normal[store.champs.normal.length - 1].valeur = "";
            } else {
                store.champs.master[store.champs.master.length - 1].valeur = "";
            }
            break;
    }
    
    next_field(li.attr("data-position"));
};

var store_document = function() {    
    var li = $(this).closest("li");

    // On referme les autres
    $(this).closest("ul").find("div").hide("slow");
    
    // On passe au premier champ disponible
    next_field(li.attr("data-position"));
    
    li.find("div").show("slow");
    li
    .find("div")
    .find("img")
        .eq(0).unbind().click(previous_page).end()
        .eq(1).unbind().click(next_page);
};

var archive_document = function() {
    var li = $(this).closest("li");
    var element = queue[li.attr("data-position")];
    var store = element.store;
    var select = li.find("select").val();
    var input = li.find("input").val();
    
    var champs = [];
    var isnew = 1;
    var cyclique = profil.mondes[store.monde].cyclique;
    
    // On alimente le type doc qui a pas de next_page
    store.type_doc.pk = select;
    store.type_doc.detail = input;
    
    store.categorie = li.find("select")
                    .find(":selected")
                    .closest("optgroup")
                    .attr("data-categorie");
    
    // Construit la liste des champs
    $.each(profil.mondes[store.monde].champs, function(i, champ) {
        champs.push({ pk: champ.pk, valeur: "" });
    });
    
    // Alimente la liste des champs avec les valeurs
    $.each(store.champs.master, function() {
        champs[this.position].valeur = this.valeur;
    });
    
    $.each(store.champs.normal, function() {
        champs[this.position].valeur = this.valeur;
    });
    
    if (profil.mondes[store.monde].cyclique == 1) {
        // Vérifie si l'opération est nouvelle
        $.each(profil.mondes[store.monde].references, function() {
            if (this == store.operation) {
                isnew = 0;
                return false;
            }
        });
    }
    
    $.ajax({
        url: "do/doStore.php",
        type: "POST",
        data: {
            filename: element.filename,
            monde: profil.mondes[store.monde].pk,
            operation: store.operation,
            categorie: profil.mondes[store.monde].categories[store.categorie].pk,
            type: store.type_doc.pk,
            detail: store.type_doc.detail,
            champs: champs,
            cyclique: cyclique,
            isnew: isnew
        },
        statusCode: {
            200: function() {
                popup("El documento ha sido archivado con exito", "confirmation"); // LOCALISATION
                queue.splice(li.attr("data-position"), 1);
                refresh_liste();
            },            
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de guarda del documento. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
}
