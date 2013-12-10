
var bootstrap_admin = function() {
    
    // Rajoute les champs dans le menu
    $.each(profil.mondes, function(i, monde) {
        var ul = $("<ul></ul>");
        var li = $("<li></li>").append("<a href='#'>" + monde.label + "</a>");
        
        $.each(monde.champs, function(j, champ) {
            ul.append(
                $("<li></li>")
                .attr({
                    "data-champ": j,
                    "data-action": "liste"
                })
                .append(
                    $("<a></a>")
                    .attr({
                        href: "#"
                    })
                    .text(champ.pluriel)
                )
            );
        });
        
        li.append(ul);
        
        $("#menu-champs").append(li);
    });
    
    $("#menu-list").menu();
    
    $("#bouton-admin").unbind().click(toggle_admin);
    
    $("#menu-list li[data-action]").click(menu_action);
};

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

var m_strUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var m_strLowerCase = "abcdefghijklmnopqrstuvwxyz";
var m_strNumber = "0123456789";
var m_strCharacters = "!@#$%^&*?_~";

var menu_action = function() {
    var a = $(this);
    var li = a.closest("li");
    var action = li.attr("data-action");
    var bootstrap_action;
    
    console.log(action);
    
    switch(action) {
        case "users":
            bootstrap_action = bootstrap_users;
            break;
    }
    
    $.ajax({
        url: "modules/admin/" + action + ".php",
        statusCode: {            
            200: function(data) {
                $("#content-admin").empty().append(data);
                bootstrap_action();
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de recuperacion de datos. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }
    });
};

var toggle_admin = function() {
    if ($("#core").is(":visible")) {
        $("#core").slideUp({
            complete: function() {
                $("#admin").slideDown();
            }
        });
    } else {
        $("#admin").slideUp({
            complete: function() {
                $("#core").slideDown();
            }
        });
    }
};
