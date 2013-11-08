
var animate_store = function() {
    if ($("#tiroir-store").attr("data-state") == "closed") {
        $("#tiroir-store").animate({ left: "30%" });
        $("#poignee-queue").animate({ left: "95%" });
        $("#tiroir-store").attr({ "data-state": "open" });
    } else {
        $("#tiroir-store").animate({ left: "-65%" });
        $("#poignee-queue").animate({ left: "30%" });
        $("#container-queue").attr({ "data-state": "closed" });
        $("#tiroir-store").attr({ "data-state": "closed" });
    }
};

var destore_monde = function() {
    
};

var store_monde = function() {
    queue[$('#tiroir-queue li[data-editing="1"]').attr("data-position")].store.monde = $(this).val();
    $("#container-champs").append(
        $("<span></span")
        .text($(this.options[this.selectedIndex])[0].label)
        .append(
            $("<a></a>")
            .text("x")
            .click(destore_monde)   
        )
    );
    $(this).hide("slow");
};

var store_document = function() {
    var li = $(this).closest("li");
    
    li.removeClass("done").attr("data-editing", "1");
    
    // On installe le viewer dans l'iframe
    
    // On nettoie le terrain
    $("#container-champs").empty();
    
    // On pose le sélecteur de mondes
    select = $("<select></select>");
        
    $.each(profil.mondes, function(i, monde) {
        select.append(
            $("<option></option>")
            .attr("value", i)
            .text(monde.label)
        );
    });
    
    $("#container-champs").append(
        "Mundo<br/>" // LOCALISATION
    ).append(
        select.change(store_monde)
    );
    
    animate_store();
};
