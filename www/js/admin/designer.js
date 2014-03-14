
var Designer = Mentorial([{ ////////////////////// SCENARIO 999
    id: 0,
    titre: "Designer",
    description: "Es un muy bueno tutorial!",
    stages: [{////////////////////// 0
        id: 0,
        raises_flag: false,
        animations: [{
            type: "code",
            code: function() {
            
            }
        }],
        clean: function() {}
    }]
}]);

var Monde = {
    label: "",
    champs: [],
    
    _refresh: function() {
        var liste = $("#liste-map");
        var li = $("<li></li>");
        var ul = $("<ul></ul>");
        var current_ul = liste;
        
        liste.empty();
        
        $.each(this.champs, function(i, champ) {
            var new_ul = ul.clone();
            
            current_ul.append(
                li.clone()
                .attr("data-id", i)
                .addClass("designer")
                .addClass("champ")
                .addClass("liste")
                .append(
                    $("<img/>")
                    .attr("src", "img/document_20.png")
                    .addClass("profil-toggle-type")
                    .click(toggle_type)
                )
                .append(
                    $("<div></div>")
                    .text(champ.label)
                    .click(toggle_champ)
                )
            ).append(
                new_ul
                .addClass("champ")
            );
            
            current_ul = new_ul;
            
            $.each(champ.types, function(j, type) {
                current_ul.append(
                    li.clone()
                    .attr("data-id", j)
                    .addClass("designer")
                    .addClass("type")
                    .addClass("liste")
                    .text(type.label)
                    .click(toggle_type)
                );
            });
        });
    }
};

var bootstrap_designer = function() {
    $("#liste").slideUp();   
    $(".admin").slideUp();
    $("#designer").fadeIn();
    
    $("#action-champ").show();
    
    $("#bouton-new-champ").unbind().click(toggle_champ);
    $("#bouton-save-champ").unbind().click(save_champ);
    $("#bouton-save-type").unbind().click(save_type);
    
    $("#designer-type-niveau").chosen({
        width: $("#new-login").outerWidth(),
        disable_search_threshold: 10,
        inherit_select_classes: true,
        allow_single_deselect: true
    });
    
    $("#designer-type-niveau").unbind().change(toggle_save_type);
};

var toggle_champ = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    var champ;
    
    $(".action").fadeOut(function() {
        $("#action-champ").fadeIn();
    
        if (bouton.attr("id") != "bouton-new-champ") {
            champ = Monde.champs[li.attr("data-id")];
            $("#action-champ").attr("data-id", li.attr("data-id"));
            $("#label-new-champ").val(champ.label);
            $("#pluriel-new-champ").val(champ.pluriel);
            $("#action-champ h1").text("Campo " + champ.label); // LOCALISATION
        } else {
            $("#label-new-champ").val("");
            $("#action-champ").attr("data-id", "");
            $("#pluriel-new-champ").val("");
            $("#action-champ h1").text("Nuevo campo"); // LOCALISATION
        }
    });
};

var toggle_type = function() {
    var bouton = $(this);
    var li = bouton.closest("li");
    
    $(".action").fadeOut(function() {
        if (bouton.hasClass("profil-toggle-type")) {
            $("#action-type")
            .fadeIn()
            .attr("data-champ", li.attr("data-id"))
            .attr("data-id", "")
            ;
        } else {
            $("#action-type")
            .fadeIn()
            .attr("data-champ", li.attr("data-champ"))
            .attr("data-id", li.attr("data-id"))
            ;
        }
        
    });
};

var save_champ = function() {
    var label = $("#label-new-champ");
    var pluriel = $("#pluriel-new-champ");
    var action = $("#action-champ");
    var champ;
    
    if (label.val() == "") {
        label.addClass("KO");
    } else {
        if (pluriel.val() == "") {
            pluriel.addClass("KO");
        } else {
            label.removeClass("KO");
            pluriel.removeClass("KO");
            
            champ = {
                label: label.val(),
                pluriel: pluriel.val(),
                types: []
            };
            
            if (action.attr("data-id") === undefined || action.attr("data-id") === "") {
                Monde.champs.push(champ);
            } else {
                Monde.champs[action.attr("data-id")] = champ;
            }
            
            label.val("");
            pluriel.val("");
            Monde._refresh();
        }
    }
};

var save_type = function() {
    var label = $("#label-new-type");
    var detail = $("#detail-new-type");
    var time = $("#time-new-type");
    var niveau = $("#designer-type-niveau");
    var action = $("#action-type");
    var champ = Monde.champs[$("#action-type").attr("data-champ")];
    var type;
    
    if (label.val() == "") {
        label.addClass("KO");
    } else {
        if (niveau.val() == "") {
            niveau.next("div").addClass("KO");
        } else {
            label.removeClass("KO");
            niveau.removeClass("KO");
            
            type = {
                label: label.val(),
                detail: detail.is(':checked'),
                time: time.is(':checked'),
                niveau: niveau.val()
            }
            
            if (action.attr("data-id") === undefined || action.attr("data-id") === "") {
                champ.types.push(type);
            } else {
                champ.types[action.attr("data-id")] = type;
            }
            
            Monde._refresh();
        }
    }
};

var toggle_save_type = function() {
    if (!$("#bouton-save-type").is(":visible")) {
        $("#bouton-save-type").slideDown();
    }
};
