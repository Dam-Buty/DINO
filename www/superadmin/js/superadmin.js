
var save_monde = function() {
    var tr = $(this).closest("tr");
    
    var cyclique;
    
    if (tr.find("input").eq(1).prop("checked") == true) {
        cyclique = 1;
    } else {
        cyclique = 0;
    }
    
    $.ajax({
        url: "do/doSaveMonde.php",
        type: "POST",
        data: {
            pk: tr.attr("data-monde"),
            client: $("#client").val(),
            label: tr.find("input").eq(0).val(),
            cyclique: cyclique,
            niveau: tr.find("input").eq(2).val()
        },
        statusCode: {
            200: function() {
                tr.find("input").val("");
                tr.find("input").eq(1).prop("checked", false);
                charge_mondes();
            }
        }
    });
};

var delete_monde = function() {
    var pk = $(this).closest("tr").attr("data-monde");

    $.ajax({
        url: "do/doDeleteMonde.php",
        type: "POST",
        data: {
            client: $("#client").val(),
            pk: pk
        },
        statusCode: {
            200: function() {
                charge_mondes();
            }
        }
    });
};

var select_monde = function() {
    var tr = $(this).closest("tr");
    
    tr.closest("table").find("tr").css("color", "black");
    tr.css("color", "red");
    
    $("#mondes").attr("data-selected", tr.attr("data-monde"));
    
    charge_champs();
}

var charge_mondes = function() {
    $.ajax({
        url: "json/mondes.php",
        type: "POST",
        data: {
            client: $("#client").val()
        },
        statusCode: {
            200: function(mondes) {
                $(".new_monde").detach().appendTo($("#mondes tbody").empty());
                $.each(mondes, function() {
                    var check_cyclique;
                    
                    if (this.cyclique == 1) {
                        check_cyclique = true;
                    } else {
                        check_cyclique = false;
                    }
                    
                    $(".new_monde")
                    .clone()
                    .removeClass()
                    .attr("data-monde", this.pk)
                    .find("input")
                        .eq(0)
                            .val(this.label)
                            .end()
                        .eq(1)
                            .prop("checked", check_cyclique)
                            .end()
                        .eq(2)
                            .val(this.niveau)
                            .end()
                        .end()
                    .find("td")
                        .eq(0)
                            .append(
                                $("<span></span>")
                                .text("Sel.")
                                .addClass("select_monde")
                            )
                            .end()
                        .end()
                    .appendTo($("#mondes tbody"))
                });
                $(".save_monde").click(save_monde);
                $(".delete_monde").click(delete_monde);
                $(".select_monde").click(select_monde);
            }
        }
    });
};

var save_champ = function() {
    var tr = $(this).closest("tr");
    
    var ispublic;
    
    if (tr.find("input").eq(2).prop("checked") == true) {
        ispublic = 1;
    } else {
        ispublic = 0;
    }
    
    $.ajax({
        url: "do/doSaveChamp.php",
        type: "POST",
        data: {
            pk: tr.attr("data-champ"),
            monde: $("#mondes").attr("data-selected"),
            client: $("#client").val(),
            label: tr.find("input").eq(0).val(),
            pluriel: tr.find("input").eq(1).val(),
            ispublic: ispublic
        },
        statusCode: {
            200: function() {
                tr.find("input").val("");
                tr.find("input").eq(2).prop("checked", false);
                charge_champs();
            }
        }
    });
};

var delete_champ = function() {

};

var select_champ = function() {
    
};

var ajout_champ = function() {
    
};

var charge_champs = function() {
    $.ajax({
        url: "json/champs.php",
        type: "POST",
        data: {
            monde: $("#mondes").attr("data-selected"),
            client: $("#client").val()
        },
        statusCode: {
            200: function(champs) {
                $(".new_champ").detach().appendTo($("#champs tbody").empty());
                
                $.each(champs, function() {
                    var check_public, couleur_aj, texte_aj, presence;
                    
                    if (this.ispublic == 1) {
                        check_public = true;
                        texte_aj = "Aj.";
                        if (this.presence == 1) {
                            couleur_aj = "green";
                        } else {
                            couleur_aj = "red";
                        }
                    } else {
                        check_public = false;
                        texte_aj = "";
                        couleur_aj = "black";
                    }
                    
                    $(".new_champ")
                    .clone()
                    .removeClass()
                    .attr({ "data-champ": this.pk, "data-ajout": presence })
                    .find("input")
                        .eq(0)
                            .val(this.label)
                            .end()
                        .eq(1)
                            .val(this.pluriel)
                            .end()
                        .eq(2)
                            .prop("checked", check_public)
                            .end()
                        .end()
                    .find("td")
                        .eq(0)
                            .append(
                                $("<span></span>")
                                .text("Sel.")
                                .addClass("select_champ")
                            )
                            .end()
                        .eq(1)
                            .append(
                                $("<span></span>")
                                .text(texte_aj)
                                .addClass("ajout_champ")
                                .css("color", couleur_aj)
                            )
                            .end()
                        .end()
                    .appendTo($("#champs tbody"))
                });
                
                $(".save_champ").click(save_champ);
                $(".delete_champ").click(delete_champ);
                $(".select_champ").click(select_champ);
                $(".ajout_champ").click(ajout_champ);
            }
        }
    });
};
