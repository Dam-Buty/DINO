

var destore_monde = function() {
    


    queue[$('#tiroir-queue li[data-editing="1"]').attr("data-position")].store.monde = "";
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
    $("#mondes-store").empty();
    
    $("#mondes-top")
    .clone()
    .attr("id", "mondes-store");
    
    // On pose le sélecteur de mondes        
    $.each(profil.mondes, function(i, monde) {
        select.append(
            $("<li></li>")
            .attr("data-monde", i)
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
