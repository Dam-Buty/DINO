
var Superadmin = {};

$(document).ready(function(){
    
    // Bind
    $("nav li").click(toggle_action);
    $("#tag-client-tokens").click(remove_client_tokens);
    $("#tag-client-moulinette").click(remove_client_moulinette);
    $("#search-tokens").keyup(search_tokens);
    $("#submit-token").click(save_token);
    $("#submit-moulinette").click(moulinette);
    
    // Récupère les listes à l'avance
    $.ajax({
        url: "json/superadmin_base.php",
        type: "GET",
        statusCode: {
            200: function(base) {
                Superadmin = base;
                
                // Peuple les combos
                $.each(Superadmin.produits, function(i, produit) {
                    $(".list-produits")
                    .append(
                        $("<option></option>")
                        .attr("value", i)
                        .text(produit)
                    );
                })
            },
            500: function() {
                alert("T'as tout casse!");
            }
        }
    });
    
    
});

var toggle_action = function() {
    var li = $(this);
    var action = li.attr("id");
    var container = $("#container-" + action);
    
    $('nav li').attr("data-state", "");
    li.attr("data-state", "active");
    
    
    $("article").hide();
    container.show();  
    bootstrap_superadmin(action);
};

var bootstrap_superadmin = function(action) {
    Superadmin.action = action;
    
    switch(action) {
        case "tokens":
            $("#list-clients-tokens").empty();
            $.each(Superadmin.clients, function(i, client) {
                $("#list-clients-tokens")
                .append(
                    $("<li></li>")
                    .attr("data-pk", client.pk)
                    .html("<b>" + client.pk + "</b> : "+ client.mail)
                    .click(toggle_client_tokens)
                );
            });
            break;
        case "activate":
            $("#list-users-activate").empty();
            
            $.each(Superadmin.clients, function(i, client) {
                $.each(client.users, function(j, user) {
                    if (user.activated == 0) {
                        $("#list-users-activate")
                        .append(
                            $("<li></li>")
                            .attr("data-login", user.login)
                            .attr("data-id", j)
                            .attr("data-client", client.pk)
                            .html("<u>" + client.mail + "</u> : <b>" + user.login + "</b> ("+ user.mail + ")")
                            .click(activate_user)
                        );
                    }
                });
            });
            break;
        case "moulinette":
            $("#list-clients-moulinette").empty();
            $.each(Superadmin.clients, function(i, client) {
                $("#list-clients-moulinette")
                .append(
                    $("<li></li>")
                    .attr("data-pk", client.pk)
                    .html("<b>" + client.pk + "</b> : "+ client.mail)
                    .click(toggle_client_moulinette)
                );
            });
            break;
        case "teuf":
            $.ajax({
                url: "do/doTeuf.php",
                type: "POST",
                data: {
                },
                statusCode: {
                    200: function(data) {
                        alert("YEAH");
                    },
                    500: function() {
                        alert("Hum hum...");
                    }
                }
            });
    };
};

var toggle_client_tokens = function() {
    var li = $(this);
    var pk = li.attr("data-pk");
    
    $("#tag-client-tokens").html(li.html());
    Superadmin.client = pk;
    
    $.ajax({
        url: "json/superadmin_cadeaux.php",
        type: "POST",
        data: {
            client: pk
        },
        statusCode: {
            200: function(tokens) {
                var cadeau = 666;
                var combo = "";
                var expired = 666;
                var used = 0;
                var classe = "";
                
                $("#list-tokens-client tbody").empty();
                
                $.each(tokens, function(i, token) {
                    var entete = "";
                    
                    if (token.cadeau != cadeau) {

                        if (token.cadeau == 0) {
                            entete = "Emplettes";
                        } else {
                            entete = "Cadeaux";
                        }
                        
                        $("#list-tokens-client tbody")
                        .append(
                            "<tr class='entete-cadeau'><td colspan='6'>" + entete + "</td></tr>"
                        );

                        cadeau = token.cadeau;
                        expired = 666;
                    }
                    
                    if (token.expired != expired) {

                        if (token.expired == 0) {
                            entete = "Valides";
                        } else {
                            entete = "Expirés";
                        }
                        
                        $("#list-tokens-client tbody")
                        .append(
                            "<tr class='entete-expired'><td colspan='6'>" + entete + "</td></tr>"
                        );

                        expired = token.expired;
                    }
                    
                    if (token.combo != 0) {
                        combo = Superadmin.combos[token.combo];
                    } else {
                        combo = "";
                    }
                    
                    if ((token.produit == 1 || token.produit == 4) && token.used == 0) {
                        classe = "unused";
                    } else {
                        classe = "";
                    }
                    
                    $("#list-tokens-client tbody")
                    .append(
                        $("<tr></tr>")
                        .addClass("ligne-token")
                        .addClass(classe)
                        .attr("data-pk", token.pk)
                        .append(
                            "<td class='cell-date'>" + token.date + "</td>"
                        )
                        .append(
                            "<td class='cell-text'>" + combo + "</td>"
                        )
                        .append(
                            "<td class='cell-text'>" + Superadmin.produits[token.produit] + "</td>"
                        )
                        .append(
                            "<td class='cell-int'>" + token.quantite + "</td>"
                        )
                        .append(
                            "<td class='cell-int'>" + token.expire + "</td>"
                        )
                        .append(
                            $("<td></td>")
                            .addClass("cell-int")
                            .addClass("delete")
                            .text("X")
                            .click(revoke_token)
                        )
                    );
                });
            },
            500: function() {
                alert("T'as tout casse!");
            }
        }
    });
    
    $("#container-client-tokens").hide();
    $("#container-cadeau").show();
};

var remove_client_tokens = function() {
    $("#tag-client-tokens").html("");
    $("#container-client-tokens").show();
    $("#container-cadeau").hide();
    
    Superadmin.client = 0;
};

var search_tokens = function() {
    var input = $(this);
    var recherche = input.val();
    
    $.each($("#list-clients-tokens li"), function(i, li) {
        $li = $(li);
        if ($li.html().indexOf(recherche) != -1) {
            $li.slideDown();
        } else {
            $li.slideUp();
        }
    });
};

var save_token = function() {
    var produit = $("#list-produits-tokens").val();
    var qte = $("#qte-cadeau").val();
    var mois = $("#duree-cadeau").val();
    
    $.ajax({
        url: "do/doGiveToken.php",
        type: "POST",
        data: {
            client: Superadmin.client,
            produit: produit,
            qte: qte,
            mois: mois
        },
        statusCode: {
            200: function() {
                $("#list-produits-tokens").val("");
                $("#qte-cadeau").val("");
                $("#duree-cadeau").val("");
                $('#list-clients-tokens li[data-pk="' + Superadmin.client + '"]').click();
            },
            500: function() {
                alert("T'as tout casse!");
            }
        }
    });
};

var revoke_token = function() {
    var td = $(this);
    var pk = td.closest("tr").attr("data-pk");
    
    $.ajax({
        url: "do/doRevokeToken.php",
        type: "POST",
        data: {
            pk: pk
        },
        statusCode: {
            200: function() {
                $('#list-clients-tokens li[data-pk="' + Superadmin.client + '"]').click();
            },
            500: function() {
                alert("T'as tout casse!");
            }
        }
    });
};

var activate_user = function() {
    var li = $(this);
    var login = li.attr("data-login");
    
    if (confirm("Confirme l'activation du turbo-translateur temporel")) {
        $.ajax({
            url: "do/doActivateMano.php",
            type: "POST",
            data: {
                login: login
            },
            statusCode: {
                200: function(data) {
                    // Marque le user comme activé dans Superadmin
                    Superadmin.clients[li.attr("data-client")].users[li.attr("data-id")].activated = 1;
                    $("#activate").click();
                    
                },
                500: function() {
                    alert("T'as tout casse!");
                }
            }
        });
    }
};

var toggle_client_moulinette = function() {
    var li = $(this);
    var pk = li.attr("data-pk");
    
    $("#tag-client-moulinette").html(li.html());
    Superadmin.client = pk;
    
    $("#list-clients-moulinette").hide();
};

var remove_client_moulinette = function() {
    $("#tag-client-moulinette").html("");
    $("#list-clients-moulinette").show();
    
    Superadmin.client = 0;
};

var moulinette = function() {
    var lignes = $("#moulinage").val().split("\n");
    var users = [];
    
    $.each(lignes, function(i, ligne) {
        var cellules = ligne.split(";");
        var mondes = cellules[2].split(",");
        
        if (cellules.length == 3) {
            users.push({
                login: cellules[0],
                mail: cellules[1],
                mondes: mondes
            });
        }
    });
    
    $.ajax({
        url: "do/doMoulinette.php",
        type: "POST",
        data: {
            client: Superadmin.client,
            gestionnaire: Superadmin.clients[Superadmin.client].gestionnaire,
            mail: Superadmin.clients[Superadmin.client].mail,
            pass: $("#pass-moulinette").val(),
            users: users
        },
        statusCode: {
            200: function() {
                alert("YEAH");
            },
            403: function() {
                alert("Il est en bois ton mot de passe!");
            },
            500: function() {
                alert("T'as tout casse!");
            }
        }
    });
};
