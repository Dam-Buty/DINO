
var Tuto = {
    etape: 0,
    sibling: undefined,
    parent: undefined,
    final_li: undefined,
    store: undefined,
    etapes: [{ ////////////////////// 0
        go: function() {
            $('#quit-tuto').tooltipster({
                content: 'Aqui para dejar el tutorial...',
                autoClose: false
            }).tooltipster("show");
            $('#bouton-tuto').tooltipster({
                content: '... y aqui para retomarlo mas tarde!',
                autoClose: false
            }).tooltipster("show");
        },
        clean: function() {
            $('#bouton-tuto').tooltipster("destroy");
            $('#quit-tuto').tooltipster("destroy");
        }
    }, { ////////////////////// 1
        go: function() {
            $("#menu-queue").click();
            $("#container-queue").css("z-index", "701");
            // TODO : jitter sur l'input file'
            setTimeout(function(){                            
                $("#container-files-handler").css("border", "2px solid #558011");
                $("#container-files-handler").tooltipster({
                    content: 'Carga un documento en DINO!',
                    position: "right",
                    autoClose: false
                }).tooltipster("show");
            }, 400);
        },
        clean: function() {
            $('#container-queue').css("z-index", "");
            $("#container-files-handler").css("border", "").tooltipster("destroy");
        }
    }, { ////////////////////// 2
        go: function() {
            $('#container-queue').css("z-index", "701");
            $("#files-list li").first().find(".bouton-edit-li").css("border", "2px solid #558011");
            $("#files-list li").first().find(".bouton-edit-li").tooltipster({
                content: 'Da click aqui para clasificar tu documento',
                position: "right",
                autoClose: false
            }).tooltipster("show");
        },
        clean: function() {
            $('#container-queue').css("z-index", "");
            $("#files-list li").first().find(".bouton-edit-li").tooltipster("destroy");
            $("#files-list li").first().find(".bouton-edit-li").css("border", "");
        }
    }, { //////////////////////3
        go: function() {
            $("#mondes-store").css("z-index", "701");
            setTimeout(function() {
                detache_element($("#mondes-store"));
                $("#mondes-store").tooltipster({
                    content: 'Selecciona uno de esos mundos',
                    autoClose: false
                }).tooltipster("show");
            }, 400);
        },
        clean: function() {
            attache_element($("#mondes-store"));
            $('#mondes-store').tooltipster("destroy");
            $("#mondes-store").css("z-index", "");
        }
    }, { ////////////////////// 4
        go: function() {
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
                content: $('<span><p>Tecla el nombre de un nuevo <b>' + champ + '</b>, y agregalo en DINO.</p></span>'),
                autoClose: false
            }).tooltipster("show");
        },
        clean: function() {
            attache_element($("#container-store"));
            $('#container-store').tooltipster("destroy");
        }
    }, { ////////////////////// 5
        go: function() {
            var monde = profil.mondes[Store.monde];
            var champ = monde.champs[monde.cascade[0]].label;
            var valeur = monde.champs[monde.cascade[0]].liste[Store.champs[monde.cascade[0]]];
            var next = monde.champs[monde.cascade[1]].label;
            
            $(".tuto-valeur").text(valeur);
            $(".tuto-next").text(next);
            
            setTimeout(function() {
                detache_element($("#container-store"));
                var last_categorie = $("#container-classification li.store-categorie").last();
                
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
                
                $("#container-classification li.store-type").tooltipster({
                    content: 'Eso es un tipo de documento!',
                    delay: 50,
                    position: "top"
                });
            }, 400);
        },
        clean: function() {
            attache_element($("#container-store"));
            $("#container-classification li.tooltipstered")
            .tooltipster("destroy");
        }
    }, { ////////////////////// 6
        go: function() {
            var monde = profil.mondes[Store.monde];
            var champ = monde.champs[Store.last_champ];
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
        },
        clean: function() {
            attache_element($("#container-store"));
            $('#container-queue').css("z-index", "");
            $("#champs-details").tooltipster("destroy");
            $("#bouton-store").tooltipster("destroy");
        }
    }, { ////////////////////// 7
        go: function() {
            var monde = profil.mondes[Store.monde];
            var valeur = Store.champs[monde.cascade[0]];
            var stack = [];
            
            $("#menu-queue").click();
            $("#opak").click();
            $('#mondes-top li[data-monde="' + Store.monde + '"]').click();
            setTimeout(function() {
                var clicks = 0;
                var li;
                $.each(profil.mondes[Tuto.store.monde].cascade, function(i, champ) {
                    
                    if (Tuto.store.champs[champ] !== undefined) {
                        li = $("#liste ul").find('li[data-type="champ"][data-pk="' + Tuto.store.champs[champ] + '"]');
                        li.click();
                        clicks = clicks + 1;
                        stack.push(Tuto.store.champs[champ]); 
                    } else {
                        return false;   
                    }                    
                });
                
                if (Tuto.store.categorie != 0) {
                    li = $("#liste ul").find('li[data-type="categorie"][data-pk="' + Tuto.store.categorie + '"][data-stack="' + stack.join(",") + '"]');
                    li.click();
                    clicks = clicks + 1;
                }
                
                li = li.next("ul").find('li[data-type-doc="' + Tuto.store.type_doc.pk + '"]')[0];
                
                Tuto.final_li = $(li);
                
                setTimeout(function() {
                    $("#liste").css("z-index", "701");
                    detache_element($("#liste"));
                    $(li).tooltipster({
                        content: 'Da click en tu documento para consultarlo!',
                        position: "bottom-left",
                        autoClose: false
                    }).tooltipster("show");
                }, clicks * 200);
            }, 400);
        },
        clean: function() {
            attache_element($("#liste"));
            Tuto.final_li.tooltipster("destroy");
            $("#liste").css("z-index", "");
        }
    }, { ////////////////////// 8
        go: function() {},
        clean: function() {}
    }, {////////////////////// 9
        go: function() {
            $("#opak").click();
            $("#mondes-top").css("z-index", "701");
            detache_element($("#mondes-top"));
            $("#mondes-top li").first().tooltipster({
                content: 'Aqui estan tus diferentes mundos documentales' ,
                position: "bottom-left",
                autoClose: false
            }).tooltipster("show");
        },
        clean: function() {
            $("#mondes-top").css("z-index", "");
            attache_element($("#mondes-top"));
            $("#mondes-top li").first().tooltipster("destroy");
        }
    }, { ////////////////////// 10
        go: function() {        
            $("#toggle-date").click();
            setTimeout(function() {
                $("#top-front").css("z-index", "701");
                detache_element($("#top-front"));
                $("#container-dates").tooltipster({
                    content: 'Aqui puedes buscar tus documentos por rango de fecha...',
                    position: "left",
                    autoClose: false
                }).tooltipster("show");
            }, 400);
        },
        clean: function() {
            $("#toggle-date").click();
            $("#top-front").css("z-index", "");
            attache_element($("#top-front"));
            $("#container-dates").tooltipster("destroy");
        }
    }, { ////////////////////// 11
        go: function() {
            var monde = profil.mondes[Core.monde];
            var champ = monde.champs[monde.cascade[0]].label;
            
            $("#search-field input").focus();
            setTimeout(function() {
                $("#search_chosen").css("z-index", "701");
                detache_element($("#search_chosen"));
                $("#search_chosen").tooltipster({
                    content: 'Tecla el nombre del ' + champ + " para encontrarlo.",
                    position: "left",
                    autoClose: false
                }).tooltipster("show");
                $("#top-front").css("margin-right", "30%");
            }, 400);
        },
        clean: function() {
            $("#search_chosen").css("z-index", "");
            attache_element($("#search_chosen"));
            $("#search_chosen").tooltipster("destroy");
            $("#top-front").css("margin-right", "");
        }
    }, { ////////////////////// 12
        go: function() {
            $(".barre-bottom").css("z-index", "701");
            detache_element($(".barre-bottom"));
        },
        clean: function() {
            window.location.replace("do/doEndTuto.php");      
        }
    }],
    go: function() {
        $("#etape-" + Tuto.etape).fadeIn();
        Tuto.etapes[Tuto.etape].go();
    },
    clean: function() {
        $(".etape").fadeOut();
        Tuto.etapes[Tuto.etape].clean();
    },
    next: function() {
        Tuto.clean();
        if (Tuto.etape < Tuto.etapes.length) {
            Tuto.etape = Tuto.etape + 1;
            Tuto.go();
        } else {
            Tuto.etape = 0;
        }
    },
    prev: function() {
        Tuto.clean();
        Tuto.etape = Tuto.etape - 1;
        Tuto.go();
    },
    start: function() {
        $("#bucket-tuto").fadeIn();
        $("#quit-tuto").click(cancel_tuto);
        $(".next").unbind().click(Tuto.next);
        Tuto.go();
    }
};


var bootstrap_tuto = function() {
    $.ajax({
        url: "modules/tuto.php",
        statusCode: {
            200: function(tuto) {
                $("body").append(tuto);
                Tuto.start();
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
    
    // Pour pouvoir replacer l'élément par la suite, on repère son parent et son sibling
    Tuto.parent = element.parent();
    if (element.prev().length == 0) {
        Tuto.sibling = false;
    } else {
        Tuto.sibling = element.prev();
    }

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
    if (Tuto.sibling === false) {
        Tuto.parent.append(element);
    } else {
        Tuto.sibling.after(element);
    }
    
    element.css({
        position: "",
        top: "",
        left: "",
        margin: "",
        width: "",
        height: ""
    })
}
