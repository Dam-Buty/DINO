
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

var resize_input = function() {
    $("#search").animate({"width": ($("#core-top").innerWidth() - $("#mondes-top").outerWidth() - $("#list-sort").outerWidth() - 20) + "px"});
};

var change_monde = function() {
    var ul = $(this).closest("ul");
    var li = $(this).closest("li");
    
    ul.find("li").attr("data-selected", "0");
    
    li.attr("data-selected", "1");
    
    Core.monde = li.attr("data-monde");
    
    $("#search").css({"width": "100px" });
    
    $("#list-sort").empty();
    Core.champs.length = 0;
    
    // On peuple le moteur de recherche / tri
    $.each(profil.mondes[Core.monde].cascade, function(i, champ) {
        var champ_profil = profil.mondes[Core.monde].champs[champ];
        
        $("#list-sort").append(
            $("<li></li>")
            .attr("data-sorted", "up")
            .attr("data-champ", champ)
            .append(
                $("<h1></h1>")
                .text(champ_profil.label)
            )
        );
        Core.champs[champ_profil.pk] = { tri: 1, group: 1, recherche: "" };
    });
    
    $("#list-sort").sortable();
    
    resize_input();
    charge_documents();
};

var charge_documents = function() {
    var termes = $("#search").val();
    var champs = [];
    
    // On récupère les champs dans l'ordre de la liste
    $.each($("#list-sort li"), function(i, li) {
    
        var champ = profil.mondes[Core.monde].champs[$(li).attr("data-champ")];
        
        champs.push(
            $.extend(Core.champs[champ.pk], { pk: champ.pk })
        );
    });
    
    $.ajax({
        url: "json/search.php",
        type: "POST",
        data: {
            monde: Core.monde,
            termes: termes,
            champs: champs,
            limit: Core.limit
        },
        statusCode: {
            200: function(liste) {
                if (Core.cyclique == 1) {
                    Core.liste = liste;
                    construit_table();
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

var trie_liste = function() {
    if (Core.cyclique == 1) {
        Core.liste.sort(function(a, b) {
            var chaine_a, chaine_b;
            
            // On prend les valeurs de champs dans l'ordre de tri 
            // On les padde à 45 caractères
            // Et on compare la chaine résultante
            $.each($("#list-sort").find("li"), function(i, li) {
                var champ = $(li).attr("data-champ");
                
                var valeur_a = profil.mondes[Core.monde].champs[champ].liste[a.champs[champ]];
                var valeur_b = profil.mondes[Core.monde].champs[champ].liste[b.champs[champ]];
                
                if (valeur_a != valeur_b) {
                    if (valeur_a < valeur_b) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
            return 0;
        });
    }
};

var construit_table = function() {
    //trie_liste();
};
