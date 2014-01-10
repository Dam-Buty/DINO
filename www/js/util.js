

// Checks a string for a list of characters
function countContain(string, reference)
{ 
    // Declare variables
    var nCount = 0;

    for (i = 0; i < string.length; i++) 
    {
        if (reference.indexOf(string.charAt(i)) > -1) 
        {
                nCount++;
        } 
    }

    return nCount; 
}

var collapse_liste = function(liste, default_state) {
    var toggle_line = function() {
        var click = $(this);
        var li = click.closest("li");
        
        if (li.attr("data-state") !== undefined) {
            if (li.attr("data-state") == "closed") {
                li.next("ul").slideDown();
                li.attr("data-state", "open");
            } else {
                li.next("ul").children('li[data-state="open"]').click();
                li.next("ul").slideUp();
                li.attr("data-state", "closed");
            }
        }
    };
    
    if (default_state === undefined) {
        default_state = "closed"
    }

    liste.find("li.liste").each(function(i, ligne) {
        if ($(ligne).next("ul").length != 0) {
            $(ligne).attr("data-state", default_state)
                .css("position", "relative")
                .append(
                    $("<div></div>")
                    .css({
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        left: 0,
                        width: "40px"
                    })
                    .css("cursor", "pointer")
                    .click(toggle_line)
                );
        }
    });
        
    if (default_state == "closed") {
        liste.find("ul").hide();
    }
};

var tip_champ = function(field, tip, ignore_KO) {
    var delay = 800;
    
    if (ignore_KO === undefined) {
        ignore_KO = false;
    }
    
    // Si le champ est en premier affichage ou en erreur
    if (!field.hasClass("OK")) {
        $(".container-arrow").not(tip).hide();
        
        tip.show().css({ opacity: 0 });
        
        tip.offset({
            top: (field.offset().top + (field.outerHeight() / 2)) - (tip.outerHeight() / 2)
        });
        
        tip.css({
            opacity: 1
        });
        
        if (field.hasClass("KO") && !ignore_KO) {
            tip.removeClass("OK").addClass("KO");
        }
    } else { // Si le champ vient de passer OK, on le repositionne
             // parceque le texte a changé
        tip.offset({
            top: (field.offset().top + (field.outerHeight() / 2)) - (tip.outerHeight() / 2)
        });
        
        // Et on le passe en vert
        tip.removeClass("KO").addClass("OK");
        setTimeout(function() {
            tip.fadeOut();
        }, delay);
    }
};
