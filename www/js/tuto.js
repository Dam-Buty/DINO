
var Tuto = {
    etape: 0,
    sibling: undefined,
    final_li: undefined,
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
                var last_categorie = $("#container-classification li.store-categorie").last();
                var first_type = $("#container-classification li.store-type").first();
                
                if (last_categorie.is(":visible")) {
                    last_categorie
                    .addClass("hasTooltip")
                    .tooltipster({
                        content: 'Eso es una categoria de documentos, y contiene tipos de documentos!',
                        position: "bottom",
                        autoClose: false
                    })
                    .tooltipster("show");
                    $("#container-classification li.store-categorie").click(function() {
                        $("#container-classification li.store-categorie").last()
                        .removeClass("hasTooltip")
                        .tooltipster("destroy");
                    });
                }
                
                if (first_type.is(":visible")) {
                    first_type.addClass("hasTooltip").tooltipster({
                        content: 'Eso es un tipo de documento!',
                        position: "left",
                        autoClose: false
                    }).tooltipster("show");
                }
                break;
            case 6:
                var monde = profil.mondes[Store.monde];
                var champ = monde.champs[monde.cascade[0]];
                var type;
                
                if (Store.categorie == 0) {
                    type = champ.types[Store.type_doc.pk].label;
                } else {
                    type = champ.categories[Store.categorie].types[Store.type_doc.pk].label;
                }
                
                $(".tuto-type").text(type);
                
                setTimeout(function() {
                    $("#container-store").css("z-index", "701");
                    detache_element($("#container-store"));
                    
                    $("#champs-details").tooltipster({
                        content: 'Modifica la fecha o agrega un detalle si necesario ...',
                        position: "left",
                        autoClose: false
                    }).tooltipster("show");
                    
                    $("#bouton-store").tooltipster({
                        content: '... y da click en "Archivar con DINO"!',
                        position: "bottom",
                        autoClose: false
                    }).tooltipster("show");
                    
                }, 400);
                break;
            case 7:
                var monde = profil.mondes[Store.monde];
                var valeur = Store.champs[monde.cascade[0]];
                
                $("#menu-queue").click();
                $("#opak").click();
                $('#mondes-top li[data-monde="' + Store.monde + '"]').click();
                setTimeout(function() {
                    var li = $("#liste ul").find('li[data-type="champ"][data-pk="' + valeur + '"]');
                    Tuto.final_li = li;
                    li.click();
                    setTimeout(function() {
                        $("#liste").css("z-index", "701");
                        detache_element($("#liste"));
                        li.next("ul").tooltipster({
                            content: 'Da click en tu documento para consultarlo!',
                            position: "bottom-left",
                            autoClose: false
                        }).tooltipster("show");
                    }, 400);
                }, 400);
                
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
            case 5:
                attache_element($("#container-store"));
                $(".hasTooltip").removeClass("hasTooltip").tooltipster("destroy");
                break;
            case 6:
                attache_element($("#container-store"));
                $('#container-queue').css("z-index", "");
                $("#champs-details").tooltipster("destroy");
                $("#bouton-store").tooltipster("destroy");
                break;
            case 7:
                attache_element($("#liste"));
                Tuto.final_li.tooltipster("destroy");
                $("#liste").css("z-index", "");
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
    Tuto.clean();
    $("#bucket-tuto").fadeOut();
    Tuto.etape = 0;
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
    });
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
