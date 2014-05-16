
var bootstrap_mondes_suppr = function() {
    var liste = $("#liste-mondes-suppr").empty();
    
    $(".front-element").hide();    
    $(".admin").hide();
    $("#mondes-suppr").fadeIn();
    $(".nom-monde").unbind().click(remove_monde_suppr);
    $("#option-supprimer").unbind().click(switch_option);
    $("#option-declass").unbind().click(switch_option);
    $("#bouton-mondes-suppr").unbind().click(popup_suppr_monde);
    $("#bouton-mondes-noaction").unbind().click(popup_suppr_monde);
    $("#no-action-suppr").hide();
    $("#action-mondes-suppr").hide();
    $("#choix-mondes-suppr").show();
    
    // Charge la liste des mondes
    $.each(profil.mondes, function(i, monde) {
        liste.append(
            $("<li></li>")
            .attr("data-pk", i)
            .text(monde.label)
            .click(toggle_monde_suppr)
        );
    });
};

var toggle_monde_suppr = function() {
    var li = $(this);
    var monde = li.attr("data-pk");
    var label = profil.mondes[monde].label;
    
    $.ajax({
        url: "do/doCountDocuments.php",
        type: "POST",
        data: {
            monde: monde
        },
        statusCode: {
            200: function(bilan) {
                var _space;
                
                $(".nom-monde").attr("data-pk", monde).text(label);
                $("#choix-mondes-suppr").hide();
                
                if (bilan.docs == 0) {
                    $("#no-action-suppr").show();
                } else {
                    $("#action-mondes-suppr").show();
                    
                    if (bilan.space < 1024) {
                        _space = bilan.space + "B"
                    }
                    
                    if (bilan.space < 1048576) {
                        _space = (bilan.space / 1024).toFixed(2) + "kB";
                    }
                    
                    if (bilan.space < 1073741824) {
                        _space = (bilan.space / 1048576).toFixed(2) + "MB";
                    } else {
                        _space = (bilan.space / 1073741824).toFixed(2) + "GB";
                    }
                    
                    $(".nb-docs-bilan").text(bilan.docs);
                    $(".space-bilan").text(_space);
                }
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup("Erreur!", "error");
            }
        }
    });
};

var remove_monde_suppr = function() {
    $("#choix-mondes-suppr").show();
    $("#action-mondes-suppr").hide();
    $("#no-action-suppr").hide();
};

var switch_option = function() {
    var option = $(this);
    
    $("#bouton-mondes-suppr").fadeIn();
    
    $("#action-mondes-suppr div.option-ok").removeClass("option-ok").addClass("option-ko");
    option.removeClass("option-ko").addClass("option-ok");
};

var popup_suppr_monde = function() {
    var option = $("#action-mondes-suppr div.option-ok");
    var para = option.find("p");
    var tag = $("#tag-mondes-suppr b.nom-monde");
    var pk = tag.attr("data-pk");
    var label = tag.text();
    var mode, url, callback;
    var docs = $(".nb-docs-bilan").eq(0).text();
    
    if (option.attr("id") == "option-supprimer") {
        mode = "delete";
    } else {
        mode = "declass";
    }
    
    if (docs > 50) {
        message = $("<p>Debido a la alta cantidad de documentos impactados, necesitamos una confirmacion para autorizar esta operacion. Nuestro servicio tecnico te contactara en los proximos 24 horas.</p>");
        url = "do/doRequestDelMonde.php";
    } else {
        if (docs > 0) {
            message = $("<p>Gracias por confirmar la supresion del mundo <b>" + label + "</b> y los pasos siguientes :</p>");
            
            message = message.append(para.clone());
            url = "do/doDelMonde.php";
        } else {
            message = $("<p>Gracias por confirmar la supresion del mundo <b>" + label + "</b>.</p>");
            
            message = message.append(para.clone());
            url = "do/doDelMonde.php";
            mode = "nada";
        }
    }
    
    dialogue = new $.Zebra_Dialog(
        message.html(), {
            type: "information",
            overlay_close: false,
            'buttons':  [ {
                caption: 'Confirmar', 
                callback: function() {
                    $.ajax({
                        url: url,
                        type: "POST",
                        data: {
                            monde: pk,
                            mode: mode
                        },
                        statusCode: {
                            200: function() {
                                window.location.replace("index.php");
                            },
                            403: function() {
                                window.location.replace("index.php");
                            },
                            500: function() {
                                popup("Erreur!", "error");
                            }
                        }
                    });
                }
            }, {
                caption: 'Cancelar', 
                callback: function() { }
            } ]
        }
    );
};
