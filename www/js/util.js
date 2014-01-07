
var collapse_liste = function(liste) {
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

    liste.find("ul").hide();
    liste.find("li.liste")
        .attr("data-state", "closed")
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
};
