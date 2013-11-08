
// pour proposer des défauts intelligents au prochain tour
var Store = {

};

var change_monde_store = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var h1 = $(this);
    var ul = h1.closest("ul");
    var li = h1.closest("li");
    
    document.store.monde = li.attr("data-monde");
    
    ul.find("li").attr("data-selected", "0");
    
    li.attr("data-selected", "1");
    
    reload_champs();
};

var reload_champs = function() {
    var document = queue[$("#popup-store").attr("data-document")];
    var monde = document.store.monde;
    
    $("#container-champs").empty();
    
    // On boucle les champs dans l'ordre de la cascade
    $.each(profil.mondes[monde].cascade, function (i, champ) {
        var div = $("<div></div>")
                    .addClass("champ-store")
                    .attr("data-champ", champ)
                    .append(
                        $("<select></select>")
                        
                    )
    
    
        $("#container-champs")
        .empty()
        .append(
            
        )
        
        
        
        
        
    });
};

var prev_document = function() {

};

var next_document = function() {
    
};

var cancel_store = function() {

};

var store_document = function() {
    var li = $(this).closest("li");
    
    $(this).closest("ul").find("li").attr("data-editing", "0");
    
    li.removeClass("done").attr("data-editing", "1");
    
    $("#popup-store").attr("data-document", li.attr("data-position"));
    
    // On binde les boutons du store
    $("#prev-store").unbind().click(prev_document);
    $("#next-store").unbind().click(next_document);
    
    // On nettoie le terrain
    $("#mondes-store").empty();
    
    // On pose le sélecteur de mondes  
    var select = $("<select></select>");
    $.each(profil.mondes, function(i, monde) {
        $("#mondes-store").append(
            $("<li></li>")
            .attr({
                "data-monde": i,
                "data-selected": 0
            })
            .append(
                $("<h1></h1>")
                .text(monde.label)
                .click(change_monde_store)
            )
        );
    });
    
    // On met par défaut le monde présent dans le Core
    $("#mondes-store li[data-monde=" + Core.monde + "]").find("h1").click();
        
    // On installe le viewer dans l'iframe
    
    // On affiche le fond opaque et le store
    $("#opak")
    .css("display", "block")
    .unbind().click(cancel_store);
    $("#popup-store").css("display", "block");
    
    // on redimensionne l'iframe
    $("#viewer-store").css("height", 0.97 * $("#popup-store").innerHeight() + $("#popup-store").offset().top - $("#viewer-store").offset().top + "px");
    $("#container-store").css("height", 0.97 * $("#popup-store").innerHeight() + $("#popup-store").offset().top - $("#viewer-store").offset().top + "px");
};

$( window ).resize(function() {
    $("#viewer-store").css("height", 0.97 * $("#popup-store").innerHeight() + $("#popup-store").offset().top - $("#viewer-store").offset().top + "px");
    $("#container-store").css("height", 0.97 * $("#popup-store").innerHeight() + $("#popup-store").offset().top - $("#viewer-store").offset().top + "px");
});
