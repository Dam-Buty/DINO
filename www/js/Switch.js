
var Switch = function(checkbox, _options) {
    // General options
    var options = $.extend({
        card_class: "designer-option",
        OK_class: "option-ok",
        OK_text: "",
        KO_class: "option-ko",
        KO_text: "",
        tip: ""
    }, _options);
    
    var display_switch = function() {
        if (checkbox.prop("checked")) {
            checkbox.next("div")
            .removeClass(options.KO_class)
            .addClass(options.OK_class)
            .find(".option-ok")
                .show()
                .end()
            .find(".option-ko")
                .hide()
                .end();
        } else {
            checkbox.next("div")
            .removeClass(options.OK_class)
            .addClass(options.KO_class)
            .find(".option-ko")
                .show()
                .end()
            .find(".option-ok")
                .hide()
                .end();
        }
    };
    
    var toggle_switch = function() {
        checkbox.prop("checked", !checkbox.prop("checked"));
        display_switch();
    };
    
    checkbox.hide().change(display_switch);
    checkbox.after(
        $("<div></div>")
        .attr("title", options.tip)
        .addClass(options.card_class)
        .append(
            $("<h1></h1>")
            .html(options.title)
        )
        .append(
            $("<p></p>")
            .addClass(options.OK_class)
            .html(options.OK_text)
        )
        .append(
            $("<p></p>")
            .addClass(options.KO_class)
            .html(options.KO_text)
        )
        .click(toggle_switch)
    );
    
    display_switch();
}
