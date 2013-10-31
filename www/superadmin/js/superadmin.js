
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
    charge_categories();
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
                $(".save_monde").unbind().click(save_monde);
                $(".delete_monde").unbind().click(delete_monde);
                $(".select_monde").unbind().click(select_monde);
            }
        }
    });
};

var save_champ = function() {
    var tr = $(this).closest("tr");
    
    var ismaster, ismulti, ispublic;
    
    if (tr.find("input").eq(2).prop("checked") == true) {
        ismaster = 1;
    } else {
        ismaster = 0;
    }
    
    if (tr.find("input").eq(3).prop("checked") == true) {
        ismulti = 1;
    } else {
        ismulti = 0;
    }
    
    if (tr.find("input").eq(4).prop("checked") == true) {
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
            ismaster: ismaster,
            ismulti: ismulti,
            ispublic: ispublic
        },
        statusCode: {
            200: function() {
                tr.find("input").val("");
                tr.find("input").eq(2).prop("checked", false);
                tr.find("input").eq(3).prop("checked", false);
                tr.find("input").eq(4).prop("checked", false);
                charge_champs();
            }
        }
    });
};

var delete_champ = function() {
    var pk = $(this).closest("tr").attr("data-champ");

    $.ajax({
        url: "do/doDeleteChamp.php",
        type: "POST",
        data: {
            client: $("#client").val(),
            monde: $("#mondes").attr("data-selected"),
            pk: pk
        },
        statusCode: {
            200: function() {
                charge_champs();
            }
        }
    });
};

var select_champ = function() {
    var tr = $(this).closest("tr");
    var pk = tr.attr("data-champ");
    var ismaster;
    
    tr.closest("table").find("tr").css("color", "black");
    tr.css("color", "red");
    
    $("#champs").attr("data-selected", pk);
        
    $.ajax({
        url: "do/doGetListe.php",
        type: "POST",
        data: {
            champ: pk
        },
        statusCode: {
            200: function(liste) {
                $("#liste_champ").val(liste);
            }
        }
    });
};

var ajout_champ = function() {
    var tr = $(this).closest("tr");
    var pk = tr.attr("data-champ");

    if (tr.find("input").eq(2).prop("checked") == true) {
        ismaster = 1;
    } else {
        ismaster = 0;
    }
    
    $.ajax({
        url: "do/doAjoutChamp.php",
        type: "POST",
        data: {
            client: $("#client").val(),
            monde: $("#mondes").attr("data-selected"),
            pk: pk,
            presence: $(this).closest("tr").attr("data-present"),
            ismaster: ismaster
        },
        statusCode: {
            200: function() {
                charge_champs();
            }
        }
    });
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
                    var couleur_aj, texte_aj;
                    var check_master, check_multi, check_public;
                    
                    if (this.ismaster == 1) {
                        check_master = true;
                    } else {
                        check_master = false;
                    }
                    
                    if (this.ismulti == 1 || this.ispublic == 1) {
                    
                        if (this.ismulti == 1) {
                            check_multi = true;
                            texte_aj = "Aj.";
                            if (this.presence == 1) {
                                couleur_aj = "blue";
                            } else {
                                couleur_aj = "red";
                            }
                        }
                        if (this.ispublic == 1) {
                            check_public = true;
                            texte_aj = "Aj.";
                            if (this.presence == 1) {
                                couleur_aj = "green";
                            } else {
                                couleur_aj = "red";
                            }
                        }                        
                    } else {
                        check_public = false;
                        texte_aj = "";
                        couleur_aj = "black";
                    }
                    
                    $(".new_champ")
                    .clone()
                    .removeClass()
                    .attr({ "data-champ": this.pk, "data-present": this.presence })
                    .find("input")
                        .eq(0)
                            .val(this.label)
                            .end()
                        .eq(1)
                            .val(this.pluriel)
                            .end()
                        .eq(2)
                            .prop("checked", check_master)
                            .end()
                        .eq(3)
                            .prop("checked", check_multi)
                            .end()
                        .eq(4)
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
                $(".save_champ").unbind().click(save_champ);
                $(".delete_champ").unbind().click(delete_champ);
                $(".select_champ").unbind().click(select_champ);
                $(".ajout_champ").unbind().click(ajout_champ);
                
            }
        }
    });
};

var save_liste = function() {
    $.ajax({
        url: "do/doSaveListe.php",
        type: "POST",
        data: {
            champ: $("#champs").attr("data-selected"),
            liste: $("#liste_champ").val()
        }
    });
};

var save_categorie = function() {
    var tr = $(this).closest("tr");
    
    $.ajax({
        url: "do/doSaveCategorie.php",
        type: "POST",
        data: {
            pk: tr.attr("data-categorie"),
            monde: $("#mondes").attr("data-selected"),
            client: $("#client").val(),
            label: tr.find("input").eq(0).val(),
            niveau: tr.find("input").eq(1).val()
        },
        statusCode: {
            200: function() {
                tr.find("input").val("");
                charge_categories();
            }
        }
    });
};

var delete_categorie = function() {
    var pk = $(this).closest("tr").attr("data-categorie");

    $.ajax({
        url: "do/doDeleteCategorie.php",
        type: "POST",
        data: {
            client: $("#client").val(),
            monde: $("#mondes").attr("data-selected"),
            pk: pk
        },
        statusCode: {
            200: function() {
                charge_categories();
            }
        }
    });
};

var select_categorie = function() {
    var tr = $(this).closest("tr");
    
    tr.closest("table").find("tr").css("color", "black");
    tr.css("color", "red");
    
    $("#categories").attr("data-selected", tr.attr("data-categorie"));
    
    charge_types();
};

var charge_categories = function() {
    $.ajax({
        url: "json/categories.php",
        type: "POST",
        data: {
            monde: $("#mondes").attr("data-selected"),
            client: $("#client").val()
        },
        statusCode: {
            200: function(categories) {
                $(".new_categorie").detach().appendTo($("#categories tbody").empty());
                $.each(categories, function() {
                    
                    $(".new_categorie")
                    .clone()
                    .removeClass()
                    .attr("data-categorie", this.pk)
                    .find("input")
                        .eq(0)
                            .val(this.label)
                            .end()
                        .eq(1)
                            .val(this.niveau)
                            .end()
                        .end()
                    .find("td")
                        .eq(0)
                            .append(
                                $("<span></span>")
                                .text("Sel.")
                                .addClass("select_categorie")
                            )
                            .end()
                        .end()
                    .appendTo($("#categories tbody"))
                });
                $(".save_categorie").unbind().click(save_categorie);
                $(".delete_categorie").unbind().click(delete_categorie);
                $(".select_categorie").unbind().click(select_categorie);
            }
        }
    });
};

var save_type = function() {
    var tr = $(this).closest("tr");
    
    var detail;
    
    if (tr.find("input").eq(1).prop("checked") == true) {
        detail = 1;
    } else {
        detail = 0;
    }
    
    $.ajax({
        url: "do/doSaveType.php",
        type: "POST",
        data: {
            pk: tr.attr("data-type"),
            client: $("#client").val(),
            monde: $("#mondes").attr("data-selected"),
            categorie: $("#categories").attr("data-selected"),
            label: tr.find("input").eq(0).val(),
            detail: detail,
            niveau: tr.find("input").eq(2).val()
        },
        statusCode: {
            200: function() {
                tr.find("input").val("");
                tr.find("input").eq(1).prop("checked", false);
                charge_types();
            }
        }
    });
};

var delete_type = function() {
    var pk = $(this).closest("tr").attr("data-type");

    $.ajax({
        url: "do/doDeleteType.php",
        type: "POST",
        data: {
            client: $("#client").val(),
            monde: $("#mondes").attr("data-selected"),
            categorie: $("#categories").attr("data-selected"),
            pk: pk
        },
        statusCode: {
            200: function() {
                charge_types();
            }
        }
    });
};

var charge_types = function() {
    $.ajax({
        url: "json/types.php",
        type: "POST",
        data: {
            client: $("#client").val(),
            monde: $("#mondes").attr("data-selected"),
            categorie: $("#categories").attr("data-selected")
        },
        statusCode: {
            200: function(types) {
                $(".new_type").detach().appendTo($("#types tbody").empty());
                $.each(types, function() {
                    var check_detail;
                    
                    if (this.detail == 1) {
                        check_detail = true;
                    } else {
                        check_detail = false;
                    }
                    
                    $(".new_type")
                    .clone()
                    .removeClass()
                    .attr("data-type", this.pk)
                    .find("input")
                        .eq(0)
                            .val(this.label)
                            .end()
                        .eq(1)
                            .prop("checked", check_detail)
                            .end()
                        .eq(2)
                            .val(this.niveau)
                            .end()
                        .end()
                    .appendTo($("#types tbody"))
                });
                $(".save_type").unbind().click(save_type);
                $(".delete_type").unbind().click(delete_type);
            }
        }
    });
};
