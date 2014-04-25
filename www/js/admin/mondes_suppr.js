
var bootstrap_mondes_suppr = function() {
    var liste = $("#liste-mondes-suppr");
    
    $("#liste").slideUp();   
    $(".admin").slideUp();
    $("#mondes-suppr").fadeIn();
    
    // Charge la liste des mondes
    $.each(profil.mondes, function(i, monde) {
        liste.append(
            $("<li></li>")
            .attr("data-pk", i)
            .text(monde.label)
            .click(suppr_monde)
        );
    });
};

var suppr_monde = function() {
    var li = $(this);
    var monde = li.attr("data-pk");
    
    $.ajax({
        url: "do/doCountDocuments.php",
        type: "POST",
        data: {
            monde: monde
        },
        statusCode: {
            200: function(bilan) {
                $("#choix-mondes-suppr").slideUp();
                $("#action-mondes-suppr").slideDown();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Erreur!", "error");
            }
        }
    });
};

