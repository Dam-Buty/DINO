

// On va déterminer le premier champ non rempli
// Et afficher dans le li correspondant
// Le formulaire correspondant (i know, rite?)
var next_field = function(position) {
    var select;
    var element = queue[position];
    var store = element.store;
    
    console.log(element);
    
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
                store.champs.length = 0;
                
                $.each(profil.mondes[store.monde].champs, function() {
                    store.champs.push("");
                });
                
                prochain_champ = 0;
            } else {
                // On parcourt pour voir si il y a des champs à renseigner
                $.each(profil.mondes[store.monde].champs, function(i, champ) {
                    if (store.champs[i] == "") {
                        prochain_champ = i;
                        return false
                    }
                });
            }
            
            if (prochain_champ !== "") {
                // Il y a un champ à renseigner, on le demande
                select = $("<select></select>");
                
                $.each(profil.mondes[store.monde].champs[prochain_champ].liste) {
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
                    
                    $.each(profil.mondes[store.monde].categories) {
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
                        // On demande le type de doc
                        select = $("<select></select>");
                        
                        // *TODO* Intégrer le champ détail dynamique
                        $.each(profil.mondes[store.monde].categories[store.categorie].types {
                            select.append(
                                $("<option></option>")
                                .attr("value", this.pk)
                                .text(this.label)
                            );
                        });
                        
                        element.li.find("div").attr("data-page", "type");
                        element.li.find("p").empty().text("Typo de documento : ").append(select);
                    }
                }
            }
        }
    }
};




var store_document = function() {    
    // On referme les autres
    $(this).closest("ul").find("div").hide("slow");
    
    // On passe au premier champ disponible
    next_field($(this).closest("li").attr("data-position"));
    
    $(this).closest("li").find("div").show("slow");
};

