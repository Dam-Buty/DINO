
var Tuto = {
    etape: 0,
    sibling: undefined,
    exit: function(next) {
        if (!next) {
            // signaler qu'il ne veut pas de next time
        }
    },
    go: function() {
        $("#etape-" + Tuto.etape).fadeIn();
        switch(Tuto.etape) {
            case 0:
                $('#quit-tuto').tooltipster({
                    content: 'Aqui para dejar el tutorial...',
                    autoClose: false
                }).tooltipster("show");
                $('#bouton-tuto').tooltipster({
                    content: '... y aqui para regresar mas tarde!',
                    autoClose: false
                }).tooltipster("show");
                $("#next-0").unbind().click(Tuto.next);
                break;
            case 1:
                $("#menu-queue").click();
                $("#container-queue").css("z-index", "701");
                
                setTimeout(function(){
                    $("#zone-dnd").tooltipster({
                        content: 'Deposita un archivo aqui ...',
                        autoClose: false
                    }).tooltipster("show");
                    
                    $("#container-files-handler").tooltipster({
                        content: '... o selecciona lo en tu disco duro!',
                        position: "right",
                        autoClose: false
                    }).tooltipster("show");
                }, 400);
                break;
            case 2:                
                $("#files-list li").first().find(".bouton-edit-li").tooltipster({
                    content: 'Da click aqui para clasificar tu documento',
                    position: "right",
                    autoClose: false
                }).tooltipster("show");
                break;
            case 3:
                $("#mondes-store").css("z-index", "701");
                setTimeout(function() {
                    detache_element($("#mondes-store"));
                    $("#mondes-store").tooltipster({
                        content: 'Selecciona uno de esos mundos',
                        autoClose: false
                    }).tooltipster("show");
                }, 400);
                break;
            case 4:
                var monde = profil.mondes[Store.monde];
                var label = monde.label;
                var champ = monde.champs[monde.cascade[0]].label;
                var pluriel = monde.champs[monde.cascade[0]].pluriel;
                
                $(".tuto-monde").text(label);
                $(".tuto-pluriel").text(pluriel);
                $(".tuto-champ").text(champ);
                
                $("#container-store").css("z-index", "701");
                detache_element($("#container-store"));
                $("#container-store").tooltipster({
                    content: $('<span><p>Da click aqui, y empeza a teclar el nombre de tu primer <b>' + champ + '</b> para agregarle a DINO.</p><p>Cuando terminaste, da click en "<b>Agregar ' + champ + '</b>" para guardarlo.</p></span>'),
                    autoClose: false
                }).tooltipster("show");
                break;
            case 5:
                var monde = profil.mondes[Store.monde];
                var champ = monde.champs[monde.cascade[0]].label;
                var valeur = monde.champs[monde.cascade[0]].liste[Store.champs[monde.cascade[0]]];
                
                $(".tuto-valeur").text(valeur);
                detache_element($("#container-store"));
                $("#container-classification li.store-categorie").last().tooltipster({
                    content: 'Eso es una categoria de documentos, y contiene tipos de documentos!',
                    position: "bottom",
                    autoClose: false
                }).tooltipster("show").click(function() {
                    $(this).tooltipster("destroy");
                });
                $("#container-classification li.store-type").first().tooltipster({
                    content: 'Eso es un tipo de documento!',
                    position: "left",
                    autoClose: false
                }).tooltipster("show");
                break;
        };
    },
    clean: function() {
        $(".etape").fadeOut();
        switch(Tuto.etape) {
            case 0:
                $('#bouton-tuto').tooltipster("destroy");
                $('#quit-tuto').tooltipster("destroy");
                break;
            case 1:
                $('#zone-dnd').css("z-index", "").tooltipster("destroy");
                $('#container-files-handler').tooltipster("destroy");
                break;
            case 2:
                $('#container-queue').css("z-index", "");
                $("#files-list li").first().find(".bouton-edit-li").tooltipster("destroy");
                break;
            case 3:
                attache_element($("#mondes-store"));
                $('#mondes-store').tooltipster("destroy");
                $("#mondes-store").css("z-index", "");
                break;
            case 4:
                attache_element($("#container-store"));
                $('#container-store').tooltipster("destroy");
                break;
        };
    },
    next: function() {
        Tuto.clean();
        Tuto.etape = Tuto.etape + 1;
        Tuto.go();
    },
    prev: function() {
        Tuto.clean();
        Tuto.etape = Tuto.etape - 1;
        Tuto.go();
    },
    center: function() {
        var div = $("#etape-" + Tuto.etape);
        div.css({
            top: ($(window).height()/2) - (div.height()/2),
            left: ($(window).width()/2) - (div.width()/2)
        })
    }
};


var bootstrap_tuto = function() {
    $.ajax({
        url: "modules/tuto.php",
        statusCode: {
            200: function(tuto) {
                $("body").append(tuto);
                $("#bucket-tuto").fadeIn();
                $("#quit-tuto").click(cancel_tuto);
                $("#opak-tuto").click(cancel_tuto);
                Tuto.go();
            }
        }
    })
};

var bootstrap_help = function() {

};

var cancel_tuto = function() {
    
};

var detache_element = function(element) {
    // On récupère ses coordonées
    var left = element.offset().left;
    var top = element.offset().top;
    
    var width = element.outerWidth();
    var height = element.outerHeight();
    
    // on garde le sibling pour pouvoir replacer l'élément après
    Tuto.sibling = element.prev();

    element.detach();
    $("body").append(element);
    element.css({
        position: "absolute",
        top: top,
        left: left,
        width: width + "px",
        height: height + "px",
        margin: 0
    })
};

var attache_element = function(element) {
    Tuto.sibling.after(element);
    element.css({
        position: "",
        top: "",
        left: "",
        margin: "",
        width: "",
        height: ""
    })
}
