
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
