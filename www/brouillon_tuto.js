, { ////////////////////// 5
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
    }
    
    
<div class="etape" id="etape-1-8">
    <h1>Tu primer documento</h1>
    <p>Muy bien, ahora sabes como archivar y consultar documentos en <b>DINO</b>!</p>
    <p>Te voy a ensenar las tecnicas avanzadas de busqueda, para convertirte en un verdadero <b>Experto Documental</b> :)</p>
    <div class="boutons next">Busqueda avanzada</div>
</div>
<div class="etape" id="etape-1-9">
    <h1>Tus mundos documentales</h1>
    <p>En <b>DINO</b>, tus documentos estan organizados por <b>mundos documentales</b>, que corresponden a diferentes aspectos de tu vida empresarial.</p>
    <p>Puedes navegar entre tus <b>mundos documentales</b> en el menu de arriba.</p>
    <div class="boutons next">Siguiente...</div>
</div>
<div class="etape" id="etape-1-10">
    <h1>Busqueda por fecha</h1>
    <p>Si necesitas documentos de una fecha especifica, puedes utilizar el slider para seleccionar un <b>rango de fecha</b>.</p>
    <div class="boutons next">Siguiente...</div>
</div>
<div class="etape" id="etape-1-11">
    <h1>Buscar en un mundo</h1>
    <p>Cada <b>mundo</b> tiene un <b>criterio de clasificacion</b> propio.</p>
    <p>Por ejemplo, en el mundo <b class="tuto-monde"></b> los documentos se clasifican por <b class="tuto-champ"></b>.</p>
    <p>El busquedor te permite buscar por <b class="tuto-champ"></b>, o cualquier <b>criterio de clasificacion</b> del <b>mundo</b> donde te encuentras.</p>
    <div class="boutons next">Siguiente...</div>
</div>
<div class="etape" id="etape-1-12">
    <h1>Tips</h1>
    <p>Ya sabes todo lo que necesitas para archivar, organizar y consultar los <b>documentos</b> de tu empresa en tu <b>archivero digital</b>!</p>
    <p>Algunos tips mas, y te dejo con <b>DINO</b> :</p>
    <p><img src="img/tuto_20.png"/> : para retomar el tutorial</p>
    <p><img src="img/printer_20.png"/> : para configurar tu impresora virtual (opcional)</p>
    <p><img src="img/mail_20.png"/> : para cambiar tu direccion de correo electronico</p>
    <p><img src="img/pass_20.png"/> : para cambiar tu contrasena personal</p>
    <p><img src="img/logout_20.png"/> : para desconectarte de DINO.</p>
    <div class="boutons next">Hasta luego!</div>
</div>
<div class="etape" id="etape-1-13">
    <h1>Tu primer mundo <b>DINO</b></h1>
    <p>Para empezar a utilizar <b>DINO</b>, necesitas a lo minimo <b>un mundo documental</b>. Los <b>mundos documentales</b> te permiten agrupar juntos los documentos que concernan cada ramo de tu empresa.</p>
    <p>Un exemplo seria el mundo <b>Ventas</b>, donde vas a organizar tus documentos por <b>Cliente</b> y por <b>Proyecto</b>.</p>
    <p>Da click en "Nuevo Mundo" para empezar a crear tu primer mundo.</p>
</div>
<div class="etape" id="etape-1-13">
    <h1>Tu primer mundo <b>DINO</b></h1>
    <p>Para empezar a utilizar <b>DINO</b>, necesitas a lo minimo <b>un mundo documental</b>. Los <b>mundos documentales</b> te permiten agrupar juntos los documentos que concernan cada ramo de tu empresa.</p>
    <p>Un exemplo seria el mundo <b>Ventas</b>, donde vas a organizar tus documentos por <b>Cliente</b> y por <b>Proyecto</b>.</p>
    <p>Da click en "Nuevo Mundo" para empezar a crear tu primer mundo.</p>
</div>
