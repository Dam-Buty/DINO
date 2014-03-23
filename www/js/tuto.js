var Scenarios = [ { ////////////////////// SCENARIO 999
        id: 0,
        titre: "Template",
        description: "Es un muy bueno tutorial!",
        stages: [{////////////////////// 0
            id: 0,
            raises_flag: true,
            animations: [{
                type: "code",
                code: function() {
                
                }
            }],
            clean: function() {}
        }]
    }, { ////////////////////// SCENARIO 1
    id: 1,
    titre: "Première visite archiviste",
    description: "Es un muy bueno tutorial!",
    stages: [{////////////////////// 0
        stage_css: {
            width: "50%",
            left: "25%",
        },
        animations: [{
            type: "tooltip",
            selector: '#bouton-tuto',
            options: {
                content: '... y aqui para retomarlo mas tarde!',
                autoClose: false
            }
        }, {
            type: "tooltip",
            selector: '#quit-tuto',
            options: {
                content: 'Aqui para dejar el tutorial...',
                autoClose: false
            }
        }]
    }, { ////////////////////// 1
        raises_flag: true,
        stage_css: {
            top: "40%",
            right: "0",
            width: "40%",
        },
        animations: [{
            type: "code",
            code: function() {
                if ($("#container-queue").attr("data-state") == "closed") {
                    $("#menu-queue").click();
                }
            }
        }, {
            type: "highlight",
            selector: "#container-queue",
            delay: 400
        }, {
            type: "border",
            selector: "#container-files-handler"
        }, {
            type: "tooltip",
            selector: "#container-files-handler",
            options: {
                content: 'Carga un documento en DINO!',
                position: "right",
                autoClose: false
            }
        }]
    }, { ////////////////////// 2
        raises_flag: true,
        stage_css: {
            top: "60%",
            right: "0",
            width: "40%",
        },
        animations: [{
            type: "highlight",
            selector: '#container-queue'
        }, {
            type: "border",
            selector: "#files-list li:first() .bouton-edit-li"
        }, {
            type: "tooltip",
            selector: "#files-list li:first() .bouton-edit-li",
            options: {
                content: 'Da click aqui para clasificar tu documento',
                position: "right",
                autoClose: false
            }
        }]
    }, { //////////////////////3
        raises_flag: true,
        stage_css: {
            top: "0",
            right: "0",
            width: "40%",
        },
        animations: [{
            type: "highlight",
            selector: "#mondes-store",
            force: true,
            delay: 400
        }, {
            type: "tooltip",
            selector: "#mondes-store li:first()",
            options: {
                content: 'Selecciona uno de esos mundos',
                autoClose: false
            }
        }]
    }, { ////////////////////// 4
        raises_flag: true,
        stage_css: {
            top: "10%",
            left: "0",
            width: "40%",
        },
        substitutions: function() {
            var leMonde = profil.mondes[Store.monde];
            return {
                monde: leMonde.label,
                champ: leMonde.champs[monde.cascade[0]].label,
                pluriel: leMonde.champs[monde.cascade[0]].pluriel
            }
        },
        animations: [{
            type: "highlight",
            selector: "#container-store",
            force: true
        }, {
            type: "tooltip",
            selector: "#container-nouveau-champ",
            options: {
                content: $('<span><p>Teclea el nombre de un nuevo <b class="tuto-pluriel"></b>, y agregalo en DINO.</p></span>'),
                autoClose: false,
                position: "top"
            }
        }]
    }, { ////////////////////// 5
        id: 5,
        raises_flag: false,
        go: function() {
            var monde = profil.mondes[Store.monde];
            var champ = monde.champs[monde.cascade[0]].label;
            var valeur = monde.champs[monde.cascade[0]].liste[Store.champs[monde.cascade[0]]];
            var next;
            
            if (monde.cascade.length > 1) {
                next = " o sigue clasificandolo en un <b>" + monde.champs[monde.cascade[1]].label + "</b> especifico"
            }
            
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
        id: 6,
        raises_flag: false,
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
        id: 7,
        raises_flag: false,
        go: function() {
            var monde = profil.mondes[Store.monde];
            var valeur = Store.champs[monde.cascade[0]];
            var stack = [];
            var li;
            var cascade = profil.mondes[Tuto.data["store"].monde].cascade;
            
            var do_click = function(i) {
                var last_click = false;
                
                if (Tuto.data.store.champs[cascade[i]] !== undefined) {
                    li = $("#liste ul").find('li[data-type="champ"][data-pk="' + Tuto.data.store.champs[cascade[i]] + '"]');
                    li.click();
                    stack.push(Tuto.data.store.champs[cascade[i]]);
                    
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
                
                if (Tuto.data.store.categorie != 0) {
                    li = $("#liste ul").find('li[data-type="categorie"][data-pk="' + Tuto.data.store.categorie + '"][data-stack="' + stack.join(",") + '"]');
                    li.click();
                    delay = 200;
                }
                
                li = li.next("ul").find('li[data-type-doc="' + Tuto.data.store.type_doc.pk + '"]')[0];
                
                Tuto.data.final_li = $(li);
                
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
            Tuto.data.final_li.tooltipster("destroy");
            $("#liste").css("z-index", "");
        }
    }, { ////////////////////// 8
        id: 8,
        raises_flag: false,
        go: function() {},
        clean: function() {}
    }, {////////////////////// 9
        id: 9,
        raises_flag: false,
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
        id: 10,
        raises_flag: false,
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
        id: 11,
        raises_flag: false,
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
        id: 12,
        raises_flag: false,
        go: function() {
            $(".barre-bottom").css("z-index", "701");
            detache_element($(".barre-bottom"));
        },
        clean: function() {
            window.location.replace("do/doEndTuto.php");
        }
    }, {////////////////////// 13
        id: 13,
        raises_flag: false,
        go: function() {
            $("#new-monde").css("z-index", "701");
            detache_element($("#new-monde"));
            $("#new-monde").tooltipster({
                content: "Da click aqui para crear tu primer mundo.",
                position: "bottom",
                autoClose: false
            }).tooltipster("show");
        },
        clean: function() {
            $("#new-monde").css("z-index", "");
            attache_element($("#new-monde"));
            $("#new-monde").tooltipster("destroy");
        }
    }]
}, { ////////////////////// SCENARIO 2
    id: 2,
    titre: "Arrivée du gérant",
    description: "Es un muy bueno tutorial!",
    stages: [{////////////////////// 0
        id: 0,
        stage_css: {
            width: "50%",
            left: "25%",
        },
        raises_flag: true,
        animations: [{
            type: "highlight",
            selector: "#menu-designer",
            force: true
        }, {
            type: "tooltip",
            selector: "#menu-designer",
            options: {
                content: 'Da click aqui!',
                autoClose: false,
                position: "right"
            }
        }]
    }, {////////////////////// 1
        id: 1,
        stage_css: {
            left: "0",
            width: "40%",
            top: "30%"
        },
        raises_flag: true,
        animations: [{
            type: "highlight",
            selector: "#nom-monde",
            force: true,
            delay: 400
        }, {
            type: "tooltip",
            selector: "#nom-monde",
            options: {
                content: 'Aqui viene el nombre de tu mundo',
                autoClose: false,
                position: "top"
            }
        }, {
            type: "highlight",
            selector: "#container-action",
            force: true
        }, {
            type: "tooltip",
            selector: "#container-action",
            options: {
                content: 'Crea tu primer campo aqui',
                autoClose: false,
                position: "bottom"
            }
        }]
    }, {////////////////////// 2
        id: 2,
        stage_css: {
            left: "0",
            width: "40%",
            top: "30%"
        },
        raises_flag: true,
        animations: [{
            type: "highlight",
            selector: "#add-doc-to-champ",
            force: true,
            delay: 400
        }, {
            type: "code",
            code: function() {
                $("#add-doc-to-champ h1").css({
                    "font-size": "1.2em"
                });
                $("#add-doc-to-champ").css({
                    "background-color": "#E7E9F0"
                });
            }
        }, {
            type: "tooltip",
            selector: "#add-doc-to-champ",
            options: {
                content: 'Click!',
                autoClose: false,
                position: "top"
            }
        }],
        clean: function() {
            $("#add-doc-to-champ h1").css({
                "font-size": ""
            });
            $("#add-doc-to-champ").css({
                "background-color": ""
            });
        },
        substitutions: function() {
            return {
                champ: Monde.champs[0].label
            };
        }
    }, {////////////////////// 3
        id: 3,
        stage_css: {
            left: "0",
            width: "40%",
            top: "30%"
        },
        raises_flag: true,
        animations: [{
            type: "highlight",
            selector: "#container-action",
            force: true,
            delay: 400
        }]
    }, {////////////////////// 4
        id: 4,
        stage_css: {
            right: "0",
            width: "40%",
            top: "30%"
        },
        raises_flag: true,
        animations: [{
            type: "highlight",
            selector: "#container-map",
            force: true,
            delay: 400
        }, {
            type: "highlight",
            selector: "#bouton-save-monde",
            force: true
        }, {
            type: "code",
            code: function() {
                $(".designer-option h1").css({
                    "font-size": "1.2em"
                });
            }
        }, {
            type: "tooltip",
            selector: "#bouton-tuto",
            options: {
                content: 'Puedes encontrar toda la documentacion sobre el uso de DINO aqui!',
                autoClose: false,
                position: "top"
            }
        }],
        clean: function() {
            $(".designer-option h1").css({
                "font-size": ""
            });
        }
    }]
} ];

var Tuto = Mentorial(Scenarios);

var bootstrap_tuto = function() {
    var liste = $("#list-tutos");
    var niveau = 0;    
    var chapitres = {
        10: "Archivar",
        20: "Administrar",
        30: "Gestionar"
    };
    var startup = false;
    var li_lien;
    
    $.each(profil.tutos, function(i, tuto) {
        var li = $("<li></li>")
            .addClass("ligne-tuto")
            .attr("data-pk", tuto.pk)
            .html(tuto.titre);
        var li_chapitre;
        
        if (tuto.niveau != niveau) {
            li_chapitre = $("<li></li>")
                .addClass("chapitre-tuto")
                .html(chapitres[tuto.niveau]);
            
            if (tuto.niveau == profil.niveau && tuto.done == 0) {
                startup = li;
            }
            
            liste.append(li_chapitre);
            niveau = tuto.niveau;
        }
        
        if (tuto.done == 0) {
            li.append(
                $("<span></span>")
                .addClass("new-tuto")
                .text("NEW!")
            );
        }
        
        liste.append(li);
    });
    
    li_lien = $("<li></li>")
        .addClass("entete-list-tutos")
        .css("font-size", "1em")
        .append(
            $("<a/>")
            .attr("href", "http://blog.dino.mx")
            .attr("target", "_blank")
            .html("Mas sciencia de DINO...")
        );
    
    liste.append(li_lien);
    
    $("#bouton-tuto").fadeIn().click(toggle_tutos);
    $(".ligne-tuto").click(function() {
        var pk = $(this).attr("data-pk");
        
        $.ajax({
            url: "modules/tuto/tuto-" + pk + ".php",
            statusCode: {
                200: function(tuto) {
                    $("#container-tuto").html(tuto);
                    //toggle_tutos();
                    Tuto.run(pk);
                },                
                404: function() {
                    popup('No se pudo cargar el tutorial. Gracias por intentar otra vez.', 'error'); // LOCALISATION
                }
            }
        });
        
    });
    
    if (startup !== false) {
        startup.click();
    }
};

var toggle_tutos = function() {
    var liste = $("#list-tutos");
    var width, height;
    height = $("#list-tutos").outerHeight();
    
    if (liste.css("bottom") == "35px") {
        liste.animate({
            bottom: (0 - height) + "px"
        });
    } else {
        width = ($(window).width() - (
            $("#bouton-tuto").offset().left + (
                $("#bouton-tuto").outerWidth() / 2
            )
        )) * 2;
        
        liste.css({
            position: "fixed",
            width: (width * 0.95) + "px",
            bottom: (0 - height) + "px",
            left: ($("#bouton-tuto").offset().left - (width / 2)) + "px"
        });
    
        liste.animate({
            bottom: "35px"
        });
    }
};


