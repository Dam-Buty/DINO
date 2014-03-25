var Scenarios = [{ ////////////////////// SCENARIO 0
    id: 0,
    titre: "Arrivée du gérant",
    description: "Es un muy bueno tutorial!",
    stages: [{////////////////////// 0
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
            top: "40%",
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
                champ: leMonde.champs[leMonde.cascade[0]].label,
                pluriel: leMonde.champs[leMonde.cascade[0]].pluriel
            }
        },
        animations: [{
            type: "highlight",
            selector: "#container-store",
            force: true,
            delay: 400
        }, {
            type: "tooltip",
            selector: "#container-nouveau-champ",
            options: {
                content: $('<span><p>Teclea el nombre de un nuevo <b class="tuto-champ"></b>, y agregalo en DINO.</p></span>'),
                autoClose: false,
                position: "top"
            }
        }]
    }, { ////////////////////// 5
        raises_flag: true,
        stage_css: {
            width: "40%",
            left: "0",
            top: "40%"
        },
        substitutions: function() {
            var monde = profil.mondes[Store.monde];
            var champ, valeur;
            
            $.each(Store.champs, function(i, pk) {
                champ = monde.champs[i];
                valeur = pk;
                return false;
            });
            
            return {
                valeur: champ.liste[valeur]
            }
        },
        animations: [{
            type: "highlight",
            selector: "#container-store",
            force: true
        }, {
            type: "tooltip",
            selector: "#container-classification",
            options: {
                content: "Elige un tipo de documento aqui",
                autoClose: false,
                position: "bottom"
            }
        }]
    }, { ////////////////////// 6
        raises_flag: true,
        stage_css: {
            width: "40%",
            left: "0",
            top: "50%"
        },
        animations: [{
            type: "highlight",
            selector: "#container-store",
            force: true
        }, {
            type: "tooltip",
            selector: "#bouton-store",
            options: {
                content: "Click!",
                autoClose: false,
                position: "bottom"
            },
            delay: 400
        }]
    }, { ////////////////////// 7
        raises_flag: true,
        stage_css: {
            width: "50%",
            left: "25%",
            top: "30%"
        },
        clean: function() {
            $("#menu-queue").click();
            $("#bouton-tuto").click();
        }
    }]
}, {
    id: 2,
    titre: "Première visite archiviste",
    description: "Es un muy bueno tutorial!",
    stages: [{ ////////////////////// 0
        stage_css: {
            width: "40%",
            left: "25%",
            top: "20%"
        },
        animations: [{
            type: "highlight",
            selector: "#top-front"
        }, {
            type: "tooltip",
            selector: "#mondes-top li:first-child",
            options: {
                content: "Aqui estan tus mundos!",
                autoClose: false,
                position: "bottom"
            },
            delay: 400
        }]
    }, { ////////////////////// 1
        stage_css: {
            width: "40%",
            left: "25%",
            top: "20%"
        },
        animations: [{
            type: "highlight",
            selector: "#top-front"
        }, {
            type: "code",
            code: function() {
                $("#toggle-date").click();
            }
        }, {
            type: "tooltip",
            selector: "#container-dates",
            options: {
                content: "Aqui para seleccionar un rango de fechas!",
                autoClose: false,
                position: "left"
            },
            delay: 400
        }],
        clean: function() {
            $("#toggle-date").click();
        }
    }, { ////////////////////// 2
        stage_css: {
            width: "40%",
            left: "0%",
            bottom: "15%"
        },
        animations: [{
            type: "highlight",
            selector: "#top-front"
        }, {
            type: "tooltip",
            selector: "#search_chosen",
            options: {
                content: "Aqui para buscar en tu mundo!",
                autoClose: false,
                position: "bottom"
            },
            delay: 400
        }]
    }]
    
}];

var Tuto = Mentorial(Scenarios, {
    exit_callback: function() {
        $.ajax({
            url: "do/doEndTuto.php",
            type: "POST",
            data: {
                tuto: Tuto.scenario
            },
            statusCode: {
                200: function() {},
                500: function() {
                    popup("Erreur!", "error");
                }
            }
        });
    },
    exit_on_opaque: false
});

var bootstrap_tuto = function() {
    var liste = $("#list-tutos");
    var liste_documentations = $("#list-documentation")
    var niveau = 0;    
    var chapitres = {
        10: "Archivar",
        20: "Administrar",
        30: "Gestionar"
    };
    var startup = false;
    
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
    
    $.each(profil.documentations, function(i, documentation) {
        var li = $("<li></li>")
            .addClass("ligne-tuto")
            .attr("data-pk", documentation.pk)
            .append(
                $("<a></a>")
                .attr("href", documentation.url)
                .text(documentation.titre)
            );
        var li_chapitre;
        
        if (documentation.niveau != niveau) {
            li_chapitre = $("<li></li>")
                .addClass("chapitre-tuto")
                .html(chapitres[documentation.niveau]);
            
            liste_documentations.append(li_chapitre);
            niveau = documentation.niveau;
        }
        
        liste_documentations.append(li);
    });
    
    $("#bouton-tuto").fadeIn().click(toggle_tutos);
    $("#toggle-university").click(toggle_university);
    
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
    var liste = $("#container-list-tutos");
    var width, height;
    height = liste.outerHeight();
    
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

var toggle_university = function() {
    var university = $("#container-list-tutos");
    var tuto = $("#list-tutos");
    var documentation = $("#list-documentation");
    
    if (university.attr("data-page") == "documentation") {
        documentation.slideUp();
        tuto.slideDown();
        university.attr("data-page", "tuto");
    } else {
        tuto.slideUp();
        documentation.slideDown();
        university.attr("data-page", "documentation");
    }
};
