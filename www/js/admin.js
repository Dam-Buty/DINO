
var bootstrap_admin = function() {
    
    $("#menu-admin").unbind().click(toggle_admin);
    
    $("#menu-retour").unbind().click(toggle_admin);
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
        $("#back").fadeOut();
        $("#front").fadeIn();
        Core.admin = false;
    } else {
        $("#front").fadeOut();
        $("#back").fadeIn();
        Core.admin = true;
        change_admin();
    }      
};
