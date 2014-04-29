
var bootstrap_mondes_suppr = function() {
    var liste = $("#liste-mondes-suppr").empty();
    
    $("#liste").slideUp();   
    $(".admin").slideUp();
    $("#mondes-suppr").fadeIn();
    $("#tag-mondes-suppr").unbind().click(remove_monde_suppr);
    $("#option-supprimer").unbind().click(switch_option);
    $("#option-declass").unbind().click(switch_option);
    
    // Charge la liste des mondes
    $.each(profil.mondes, function(i, monde) {
        liste.append(
            $("<li></li>")
            .attr("data-pk", i)
            .text(monde.label)
            .click(toggle_monde_suppr)
        );
    });
};

var toggle_monde_suppr = function() {
    var li = $(this);
    var monde = li.attr("data-pk");
    var label = profil.mondes[monde].label;
    
    $.ajax({
        url: "do/doCountDocuments.php",
        type: "POST",
        data: {
            monde: monde
        },
        statusCode: {
            200: function(bilan) {
                $(".nom-monde").text(label);
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

var remove_monde_suppr = function() {
    $("#choix-mondes-suppr").slideDown();
    $("#action-mondes-suppr").slideUp();
};

var switch_option = function() {
    var option_supprimer = $(this);
    
    if (option.hasClass("option-OK")) {
        option.removeClass("option")
    } else {
        
    }
};

