
var Core = {
    monde: 0,
    cyclique: 0,
    tri: [],
    recherche: [],
    limit: 100,
    liste: []
};

var bootstrap_list = function() {
    // D'abord on va peupler la liste des mondes
    // Et la liste des champs pour le busquedor
    
    $.each(profil.mondes, function(i, monde) {
        $("#list-mondes").append(
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
    
    $("#list-mondes").find("h1").eq(0).click();
};

var trie_core = function() {
    var newCore = [];
        
    // pour chaque élément de la liste dans l'ordre
    $.each($("#list-sort").find("li"), function(i, li) {
        var champ = $(li).attr("data-champ");
        
        // on le retrouve dans le Core
        // et on le copie dans le newCore
        $.each(Core.tri, function(j, element) {
            if (element.id == champ) {
                newCore.push(element);
            }
        });
        
    });
    console.log(newCore);
    // On met tout ça dans le Core
    Core.tri = newCore;
};

var resize_input = function() {
    $("#search").animate({"width": ($("#core-top").innerWidth() - $("#list-mondes").outerWidth() - $("#list-sort").outerWidth() - 20) + "px"});
};

var change_monde = function() {
    var ul = $(this).closest("ul");
    var li = $(this).closest("li");
    
    ul.find("li").attr("data-selected", "0");
    
    li.attr("data-selected", "1");
    
    Core.monde = li.attr("data-monde");
    Core.cyclique = profil.mondes[Core.monde].cyclique;
    
    $("#search").css({"width": "100px" });
    
    $("#list-sort").empty();
    Core.tri.length = 0;
    
    // On peuple le moteur de recherche / tri
    $.each(profil.mondes[Core.monde].champs, function(i, champ) {
        $("#list-sort").append(
            $("<li></li>")
            .attr({
                "data-champ": i,
                "data-sorted": "up"
            })
            .append(
                $("<h1></h1>")
                .text(champ.label)
            )
        );
        Core.tri.push({ id: i, sens: "+", text: "" });
    });
    
    // On ajoute l'opération comme critère
    Core.tri.push({ id: "op", sens: "+", text: "" });
    
    $("#list-sort").append(
        $("<li></li>")
        .attr({
            "data-champ": "op",
            "data-sorted": "up"
        })
        .append(
            $("<h1></h1>")
            .text("Operacion") // LOCALISATION
        )
    );
    
    // On ajoute le document comme critère
    Core.tri.push({ id: "doc", sens: "+", text: "" });
    
    $("#list-sort").append(
        $("<li></li>")
        .attr({
            "data-champ": "doc",
            "data-sorted": "up"
        })
        .append(
            $("<h1></h1>")
            .text("Documento") // LOCALISATION
        )
    );
    
    $("#list-sort").sortable();
    $("#list-sort").sortable().bind('sortupdate', trie_core);
    
    resize_input();
    charge_documents();
};

var charge_documents = function() {
    var termes = $("#search").val();
    
    $.ajax({
        url: "json/search.php",
        type: "POST",
        data: {
            monde: profil.mondes[Core.monde].pk,
            cyclique: Core.cyclique,
            termes: termes,
            recherche: Core.recherche,
            limit: Core.limit
        },
        statusCode: {
            200: function(liste) {
                if (Core.cyclique == "1") {
                    $.each(liste, function(i, operation) {
                        // On commence par résoudre les valeurs et les pk
                        // de champs
                        var lOperation = $.extend(true, {}, operation);
                        
                        lOperation.champs.length = 0;
                        lOperation.documents.length = 0;
                        
                        $.each(operation.champs, function(j, champ_reference) {
                            var leChamp = { id: "", label: "" };
                            
                            $.each(profil.mondes[Core.monde].champs, function(k, champ_profil) {
                                if (champ_profil.pk == champ_reference.champ) {                                    
                                    $.each(champ_profil.liste, function(l, valeur) {
                                        if (valeur.pk == champ_reference.valeur) {
                                            leChamp.id = l;
                                            leChamp.label = valeur.label;
                                        }
                                    });
                                }
                            });
                            
                            lOperation.champs.push(leChamp);
                        });
                        
                        var oldDoc = {};
                        
                        $.each(operation.documents, function(j, document) {
                            var leDocument = $.extend(true, {}, document, { revisions: [] });
                            // TODO : dans le oldDoc on a des ID de catégories
                            //        dans leDocument on a des PK
                            // Si c'est une révision antérieure du document
                            // en cours on stocke juste les infos de révision
                            if (leDocument.categorie == oldDoc.categorie && leDocument.type == oldDoc.type) {
                                oldDoc.revisions.push({ num: leDocument.revision, filename: leDocument.filename, user: leDocument.user, date: leDocument.date });
                            } else {
                                // On n'est plus sur des révisions du bidule
                                // on le pousse dans l'opération 
                                // (si c'est pas le 1er oldDoc vide {}
                                if ("filename" in oldDoc) {
                                    lOperation.documents.push(oldDoc);
                                }
                                
                                
                                // sinon on stocke le doc normalement
                                $.each(profil.mondes[Core.monde].categories, function(k, categorie) {
                                    if (categorie.pk == document.categorie) {
                                        leDocument.categorie = k;
                                        
                                        $.each(categorie.types, function(l, type) {
                                            if (type.pk == document.type) {
                                                leDocument.type = l;
                                            }
                                        });
                                    }
                                });
                                oldDoc = $.extend(true, {}, leDocument);
                            }
                        });
                        Core.liste.push(lOperation);
                    });
                }
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
