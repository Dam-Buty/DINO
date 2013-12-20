
var bootstrap_admin = function() {
    
    // Rajoute les champs dans le menu
//    $.each(profil.mondes, function(i, monde) {        
//        $("#sous-menu-monde").append(
//            $("<li></li>")
//            .attr({
//                "data-action": "monde",
//                "data-monde": i
//            })
//            .append("<a href='#'>Mundo " + monde.label + "</a>")
//        );   
//        $("#sous-menu-profil").append(
//            $("<li></li>")
//            .attr({
//                "data-action": "profil",
//                "data-monde": i
//            })
//            .append("<a href='#'>Mundo " + monde.label + "</a>")
//        );
//    });
    
    $("#menu-admin").unbind().click(toggle_admin);
    $("#menu-retour").unbind().click(toggle_admin);
    $("#menu-users").unbind().click(change_admin);
    $("#menu-listes").unbind().click(change_admin);
    $("#menu-admin").unbind().click(toggle_admin);
    
};

var change_admin = function() {
    var div = $(this);
    
    $("#backoffice>h1").fadeOut();
    $("#backoffice>div").fadeOut();
    
    switch(div.attr("id")) {
        case "menu-users":
            bootstrap_users();
            break;
            
        case "menu-listes":
            bootstrap_monde();
            break;
            
        case "menu-profil":
            bootstrap_profil();
            break;
    }
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


//var menu_action = function() {
//    var a = $(this);
//    var li = a.closest("li");
//    var action = li.attr("data-action");
//    var monde = li.attr("data-monde");
//    var bootstrap_action;
//    
//    switch(action) {
//        case "users":
//            bootstrap_action = bootstrap_users;
//            break;
//            
//        case "monde":
//            bootstrap_action = bootstrap_monde;
//            break;
//            
//        case "profil":
//            bootstrap_action = bootstrap_profil;
//            break;
//    }
//    
//    $.ajax({
//        url: "modules/admin/" + action + ".php",
//        statusCode: {            
//            200: function(data) {
//                $("#content-admin").empty().append(data);
//                
//                if (action == "monde") {
//                    $("#liste-valeurs").attr("data-monde", monde);
//                }
//                
//                if (action == "profil") {
//                    $("#liste-profil").attr("data-monde", monde);
//                }
//                
//                bootstrap_action();
//            },
//            403: function() {
//                window.location.replace("index.php");
//            },
//            500: function() {
//                popup('Error de recuperacion de datos. Gracias por intentar otra vez', 'error'); // LOCALISATION
//            }
//        }
//    });
//};

var toggle_admin = function() {
    if (Core.admin) {
        $(".barre-bottom").fadeOut();
        $("#back").fadeOut({
            complete: function() {
                $("#front").fadeIn();
                $(".barre-bottom").css({
                    left: "10%",
                    width: "90%"
                }).fadeIn();
            }
        });
        Core.admin = false;
    } else {
        $(".barre-bottom").fadeOut();
        $("#front").fadeOut({
            complete: function() {
                $("#back").fadeIn();
                $(".barre-bottom").css({
                    left: "15%",
                    width: "85%"
                }).fadeIn();
            }
        });
        Core.admin = true;
        bootstrap_users();
    }
            
};
