

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
    
    if (field.hasClass("edit-niveau")) {
        tip.css({
            "z-index": 200,
            "left": "45%",
            "width": "45%"
        });
    } else {
        tip.css({
            "z-index": "",
            "left": "",
            "width": ""
        });
    }
};

var debug_liste = function() {
    var stack = [];
    var monde = profil.mondes[Core.monde];
    var categorie = 0;
    var label_categorie = "";
    var niveau = 0;
    var label;
    
    $.each(Core.liste, function(i, ligne) {
        switch(ligne.type) {
            case "champ":
                label = monde.champs[monde.cascade[ligne.niveau]].liste[ligne.pk];
                categorie = 0;
                label_categorie = "";
                
                niveau = ligne.niveau;
                if (ligne.niveau + 1 == stack.length) {
                    stack[ligne.niveau] = label;
                } else {
                    if (ligne.niveau + 1 > stack.length) {
                        stack.push(label);
                    } else {
                        stack.length = ligne.niveau + 1;
                        stack[ligne.niveau] = label;
                    }
                }
                break;
            case "categorie":
                categorie = ligne.pk;
                label_categorie = monde.champs[monde.cascade[ligne.niveau - 1]].categories[ligne.pk].label;
                break;
            default:
                var type, retour;
                
                if (categorie == 0) {
                    type = monde.champs[monde.cascade[niveau]].types[ligne.type];
                } else {
                    type = monde.champs[monde.cascade[niveau]].categories[categorie].types[ligne.type];
                }
                
                label = type.label;
                
                retour = "";
                
                $.each(stack, function(i, champ) {
                   retour += "__" + champ;
                });
                
                if (categorie != 0) {
                    retour += "__" + label_categorie;
                }
                
                retour += "__" + label;
                retour = stack.length + " : " + retour;
                console.log(retour);
        }
    })  
};

var chat = function () { 
    var done = false; 
    var script = document.createElement('script'); 
    script.async = true; 
    script.type = 'text/javascript'; 
    script.src = 'https://www.purechat.com/VisitorWidget/WidgetScript'; 
    document.getElementsByTagName('HEAD').item(0).appendChild(script); 
    script.onreadystatechange = script.onload = function (e) { 
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) { 
            var w = new PCWidget({ 
                c: '15d4cfc0-8fae-4e70-8294-389f583f897f', 
                f: true 
            }); 
            done = true; 
        } 
    }; 
};
