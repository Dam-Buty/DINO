
var bootstrap_admin = function() {
    
    $("#menu-admin").unbind().click(toggle_admin);
    
    $("#menu-retour").unbind().click(toggle_admin);
    
    $("#bouton-admin-liste").unbind().click(bootstrap_monde);
};

var change_admin = function() {
    var div = $(this);
    var li = div.closest("li");
    
    li.closest("ul").find("li").attr("data-selected", 0);
    li.attr("data-selected", 1);
    
    $("#backoffice>h1").fadeOut();
    $("#backoffice>div").fadeOut();
    
    bootstrap_users();
};

var toggle_admin = function() {
    popup_designer(_toggle_admin);
};

var _toggle_admin = function() {
    if (Core.admin) {
        $(".barre-bottom").fadeOut();
        $("#back").fadeOut({
            complete: function() {
                $("#front").fadeIn();
                $(".barre-bottom").css({
                    left: "10%",
                    width: "90%"
                }).fadeIn();
                $("#container-icones-admin").fadeIn();
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
        $("#container-icones-admin").fadeOut();
        Core.admin = true;
        change_admin();
    }      
};
