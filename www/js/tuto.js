
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
            if ($("#container-queue").attr("data-state") == "closed") {
                $("#menu-queue").click();
            }
            
            setTimeout(function(){           
                $("#container-queue").css("z-index", "701");                 
                $("#container-files-handler").css("border", "2px solid #DB7F1A");
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
            $("#files-list li").first().find(".bouton-edit-li").css("border", "2px solid #DB7F1A");
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
                $("#mondes-store li").first().tooltipster({
                    content: 'Selecciona uno de esos mundos',
                    autoClose: false
                }).tooltipster("show");
            }, 400);
        },
        clean: function() {
            attache_element($("#mondes-store"));
            $('#mondes-store li').first().tooltipster("destroy");
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
            $("#container-nouveau-champ").tooltipster({
                content: $('<span><p>Teclea el nombre de un nuevo <b>' + champ + '</b>, y agregalo en DINO.</p></span>'),
                autoClose: false,
                position: "top"
            }).tooltipster("show");
        },
        clean: function() {
            attache_element($("#container-store"));
            $('#container-nouveau-champ').tooltipster("destroy");
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
                var last_categorie = $("#list-classification li.store-categorie").last();
                
                if (last_categorie.is(":visible")) {
                    last_categorie
                    .addClass("hasTooltip")
                    .tooltipster({
                        content: 'Eso es una categoria de documentos, y contiene tipos de documentos!',
                        position: "bottom",
                        autoClose: false
                    })
                    .tooltipster("show");
                    $("#list-classification li.store-categorie").click(function() {
                        $("#list-classification li.store-categorie").last()
                        .removeClass("hasTooltip")
                        .tooltipster("destroy");
                    });
                }
                
                $("#list-classification li.store-type").tooltipster({
                    content: 'Eso es un tipo de documento!',
                    delay: 50,
                    position: "top"
                });
            }, 400);
        },
        clean: function() {
            attache_element($("#container-store"));
            $("#list-classification li.tooltipstered")
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
            var li;
            var cascade = profil.mondes[Tuto.store.monde].cascade;
            
            var do_click = function(i) {
                var last_click = false;
                
                if (Tuto.store.champs[cascade[i]] !== undefined) {
                    li = $("#liste ul").find('li[data-type="champ"][data-pk="' + Tuto.store.champs[cascade[i]] + '"]');
                    li.click();
                    stack.push(Tuto.store.champs[cascade[i]]);
                    
                    if (i < cascade.length - 1) {
                        setTimeout(function() {
                            do_click(i + 1);
                        }, 200);
                    } else {
                        last_click = true;
                    }
                } else {
                    last_click = true;
                }
                
                if (last_click) {
                    setTimeout(function() {
                        end_click();
                    }, 200);
                }
            };
            
            var end_click = function() {
                var delay = 0;
                
                if (Tuto.store.categorie != 0) {
                    li = $("#liste ul").find('li[data-type="categorie"][data-pk="' + Tuto.store.categorie + '"][data-stack="' + stack.join(",") + '"]');
                    li.click();
                    delay = 200;
                }
                
                li = li.next("ul").find('li[data-type-doc="' + Tuto.store.type_doc.pk + '"]')[0];
                
                Tuto.final_li = $(li);
                
                setTimeout(function() {
                    $(li).tooltipster({
                        content: 'Da click en tu documento para consultarlo!',
                        position: "bottom-left",
                        autoClose: false
                    }).tooltipster("show");
                }, delay);
            };
            
            $("#menu-queue").click();
            
            setTimeout(function() {
                $("#liste").css("z-index", "701");
                detache_element($("#liste"));
                
                do_click(0);
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
                    content: 'Teclea el nombre del ' + champ + " para encontrarlo.",
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
                
                if (profil.tuto == 1 && profil.niveau >= 10 && window.location.search != "?notuto") {
                    Tuto.start();
                } 
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
    chat();
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
