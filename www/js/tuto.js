var Scenarios = [{ ////////////////////// SCENARIO 0
    id: 0,
    titre: "Premier monde",
    description: "Es un muy bueno tutorial!",
    stages: [{////////////////////// 0
        stage_css: {
            top: "20%",
            width: "50%",
            left: "25%",
        },
        raises_flag: true,
        animations: [{
            type: "code",
            code: function() {
                if ($("#backoffice").is(":visible")) {
                    $("#menu-retour").click();
                }
                $("#lien-zero").click(function() {
                    Tuto.exit();
                    setTimeout(function() {
                        Tuto.run(1);
                    }, 800);
                });
            }
        }, {
            type: "highlight",
            selector: "#menu-designer",
            force: true,
            delay: 400
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
            right: "0",
            width: "60%",
            bottom: "0"
        },
        raises_flag: true,
        animations: [{
            type: "highlight",
            selector: "#container-templates",
            force: true,
            delay: 400
        }, {
            type: "tooltip",
            selector: '#list_templates_chosen',
            options: {
                content: 'Elige un mundo pre-dise&ntilde;ado',
                autoClose: false,
                position: "top-right",
                contentAsHTML: true
            }
        }]
    }, {////////////////////// 2
        stage_css: {
            right: "0",
            width: "50%",
            bottom: "0"
        },
        raises_flag: true,
        animations: [{
            type: "highlight",
            selector: "#container-map",
            force: true,
            delay: 400
        }, {
            type: "highlight",
            selector: "#list_templates_chosen",
            force: true
        }, {
            type: "highlight",
            selector: "#bouton-save-monde",
            force: true
        }, {
            type: "tooltip",
            selector: '#bouton-save-monde',
            options: {
                content: 'Guarda tu mundo',
                autoClose: false,
                position: "left",
                contentAsHTML: true
            }
        }],
        substitutions: function() {
            return {
                monde: Monde.label
            };
        }
    }]
}, { ////////////////////// SCENARIO 1
    titre: "Créer un monde de zéro",
    description: "",
    stages: [{ ///////////////////////0
        stage_css: {
            width: "50%",
            left: "25%",
        },
        animations: [{
            type: "code",
            code: function() {
                if ($("#backoffice").is(":visible")) {
                    $("#menu-retour").click();
                } else {
                    if (!$("#liste").is(":visible")) {
                        $('#mondes-top li[data-selected="1"]').click();
                    }
                }
            }
        }]
    }, { ///////////////////////1
        raises_flag: true,
        stage_css: {
            width: "40%",
            top: "20%",
            right: "0",
        },
        animations: [{
            type: "highlight",
            force: true,
            selector: "#menu-designer"
        }, {
            type: "tooltip",
            selector: '#menu-designer',
            options: {
                content: 'Aqui para crear un mundo !',
                autoClose: false,
                position: "right"
            },
            delay: 400
        }]
    }, { ///////////////////////2
        raises_flag: true,
        stage_css: {
            width: "40%",
            bottom: "20%",
            right: "0"
        },
        animations: [{
            type: "highlight",
            force: true,
            selector: "#container-map",
            delay: 400
        }, {
            type: "tooltip",
            selector: '#container-map span.designer-add-champ',
            options: {
                content: 'Aqui para crear un campo !',
                autoClose: false,
                position: "bottom"
            }
        }]
    }, { ////////////////////// 3
        raises_flag: true,
        stage_css: {
            width: "40%",
            top: "20%",
            left: "0"
        },
        animations: [{
            type: "highlight",
            force: true,
            selector: "#container-action",
            delay: 400
        }, {
            type: "tooltip",
            selector: "#bouton-save-champ",
            options: {
                content: 'Aqui para guardar tu campo !',
                autoClose: false,
                position: "bottom"
            }
        }]
    }, { ////////////////////// 4
        raises_flag: true,
        stage_css: {
            width: "40%",
            bottom: "20%",
            right: "0"
        },
        animations: [{
            type: "highlight",
            force: true,
            selector: "#container-map",
            delay: 400
        }, {
            type: "tooltip",
            selector: "#liste-map li:first-child() img.profil-toggle-type",
            options: {
                content: 'Aqui para agregar un tipo de documento !',
                autoClose: false,
                position: "bottom"
            }
        }],
        substitutions: function() {
            return {
                champ: Monde.champs[0].label
            };
        }
    }, { ////////////////////// 5
        raises_flag: true,
        stage_css: {
            width: "40%",
            top: "20%",
            left: "0"
        },
        animations: [{
            type: "highlight",
            force: true,
            selector: "#container-action",
            delay: 400
        }, {
            type: "code",
            code: function() {
                $("#action-type div.designer-option h1").css({
                    "font-size": "1.2em"
                });
            }
        }, {
            type: "tooltip",
            selector: "#bouton-save-type",
            options: {
                content: 'No olvides de guardar!',
                autoClose: false,
                position: "bottom"
            }
        }],
        clean: function() {
            $("#action-type div.designer-option h1").css({
                "font-size": ""
            });
        }
    }, { ////////////////////// 6
        stage_css: {
            width: "50%",
            left: "25%",
            top: "20%",
        },
        animations: [{
            type: "highlight",
            force: true,
            selector: "#bouton-save-monde",
            delay: 400
        }, {
            type: "tooltip",
            selector: "#bouton-save-monde",
            options: {
                content: 'Aqui para publicar tu mundo!',
                autoClose: false,
                position: "bottom"
            }
        }]
        
    }]
}, { ////////////////////// SCENARIO 2
    titre: "Charger un document",
    description: "Es un muy bueno tutorial!",
    stages: [{////////////////////// 0
        stage_css: {
            width: "50%",
            left: "25%",
        },
        animations: [{
            type: "code",
            code: function() {
                if ($("#backoffice").is(":visible")) {
                    $("#menu-retour").click();
                } else {
                    if (!$("#liste").is(":visible")) {
                        $('#mondes-top li[data-selected="1"]').click();
                    }
                }
            }
        }, {
            type: "tooltip",
            selector: '#bouton-tuto',
            options: {
                content: '... y aqui para retomarlo mas tarde!',
                autoClose: false
            },
            delay: 400
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
            selector: "#files-list li:first()"
        }, {
            type: "tooltip",
            selector: "#files-list li:first()",
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
        skip_clause: function() {
            return ($("#mondes-top li").length == 1);
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
        }
    }]
}, { ////////////////////// SCENARIO 3
    titre: "Chercher un document",
    description: "Es un muy bueno tutorial!",
    stages: [{ ////////////////////// 0
        stage_css: {
            width: "60%",
            left: "20%",
            top: "20%"
        },
        animations: [{
            type: "code",
            code: function() {
                if ($("#backoffice").is(":visible")) {
                    $("#menu-retour").click();
                }
            }
        }, {
            type: "highlight",
            selector: "#top-front",
            delay: 400
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
        substitutions: function() {
            var monde = profil.mondes[Core.monde];
            var champ = monde.champs[monde.cascade[0]].label;
            
            monde = monde.label;            
            
            return {
                monde: monde,
                champ: champ
            };
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
    
}, { ////////////////////// SCENARIO 4
    titre: "Admin utilisateurs",
    description: "",
    stages: [{ ////////////////////// 0
        raises_flag: true,
        stage_css: {
            width: "40%",
            left: "25%",
            top: "20%"
        },
        animations: [{
            type: "code",
            code: function() {
                if ($("#backoffice").is(":visible")) {
                    $("#menu-retour").click();
                }
            }
        }, {
            type: "highlight",
            selector: "#menu-admin",
            force: true,
            delay: 600
        }, {
            type: "tooltip",
            selector: "#menu-admin",
            options: {
                content: "Click!",
                autoClose: false,
                position: "top-right"
            },
            delay: 400
        }]
    }, { ////////////////////// 1
        raises_flag: true,
        stage_css: {
            width: "40%",
            left: "25%",
            top: "35%"
        },
        animations: [{
            type: "highlight",
            selector: "#tokens-OK",
            force: true,
            delay: 400
        }, {
            type: "tooltip",
            selector: "#tokens-OK",
            options: {
                content: "Click!",
                autoClose: false,
                position: "bottom"
            },
            delay: 400
        }]
    }, { ////////////////////// 2
        raises_flag: true,
        stage_css: {
            width: "40%",
            left: "25%",
            bottom: "0"
        },
        animations: [{
            type: "highlight",
            selector: "#container-new-user",
            force: true
        }, {
            type: "code",
            code: function() {
                $("#container-new-user").css("background-color", "#E7E9F0");
                $("#container-new-user ul").css("list-style-type", "none");
            }
        }],
        clean: function() {
            $("#container-new-user").css("background-color", "");
            $("#container-new-user ul").css("list-style-type", "");
        }
    }, { ////////////////////// 3
        stage_css: {
            width: "40%",
            left: "0",
            bottom: "20%"
        },
        animations: [{
            type: "highlight",
            selector: "#regles-new-user",
            force: true
        }, {
            type: "code",
            code: function() {
                $("#regles-new-user ul").css("list-style-type", "none");
            }
        }],
        substitutions: function() {
            var monde = profil.mondes[$("#regles-new-user li:first-child").attr("data-monde")];
            
            return {
                monde: monde.label,
                champ: monde.champs[monde.cascade[0]].label
            };
        },
        clean: function() {
            $("#regles-new-user ul").css("list-style-type", "");
        }
    }]
}];

var Tuto = Mentorial(Scenarios, {
    exit_callback: function(scenario,stage) {
        
        var end_tuto = function() {
            $('#list-tutos li.ligne-tuto[data-pk="' + scenario + '"]').find(".new-tuto").remove();
            
            $.ajax({
                url: "do/doEndTuto.php",
                type: "POST",
                data: {
                    tuto: scenario
                },
                statusCode: {
                    200: function() {
                        $("#bouton-tuto").tooltipster("show");
                    },
                    500: function() {
                        popup("Erreur!", "error");
                    }
                }
            });
        };
        
        if (Tuto.bootstrapped) {
            if (stage < Tuto.Scenarios[scenario].stages.length - 1) {
                popup_tuto(end_tuto);
            } else {
                end_tuto();
            }
            Tuto.bootstrapped = false;
        } else {
            end_tuto();
        }
        
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
    
    // Pour le deuxième login du gestionnaire (après avoir créé son premier monde), on lui propose d'emblée le tutorial de chargement
    if (profil.niveau == 30 && profil.tutos[0].done == "1" && profil.tutos[2].done != "1" && Object.keys(profil.mondes).length > 0) {
        startup = $('li.ligne-tuto[data-pk="2"]');
        Tuto.alternative = true;
    }
    
    $.each(profil.documentations, function(i, documentation) {
        var li = $("<li></li>")
            .addClass("ligne-tuto")
            .attr("data-pk", documentation.pk)
            .append(
                $("<a></a>")
                .attr("href", documentation.url)
                .attr("target", "_blank")
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
    
    $("#list-tutos .ligne-tuto").click(function() {
        var pk = $(this).attr("data-pk");
        
        if ($("#container-list-tutos").css("bottom") == "35px") {
            $("#bouton-tuto").click();
        }
        
        Tuto.run(pk);
    });
    
    $("#bouton-tuto")
    .tooltipster({
        content: $("<p>No olvides que puedes encontrar toda la documentacion de DINO aqui!</p>"),
        position: "top",
        timer: 1200
    });
    
    if (startup !== false) {
        Tuto.bootstrapped = true;
        startup.click();
    } else {
        $("#bouton-tuto").tooltipster("show");
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
