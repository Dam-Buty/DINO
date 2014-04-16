
var Superadmin = {
    action: "",
    client: 0
}
var Clients = {};

$(document).ready(function(){
    CKEDITOR.replace( 'message' );
    
    // Bind
    $("nav li").click(toggle_action);
    $("#tag-client-tokens").click(remove_client_tokens);
    $("#search-tokens").keyup(search_tokens);
    
    // Récupère les listes à l'avance
    $.ajax({
        url: "json/superadmin_base.php",
        type: "GET",
        statusCode: {
            200: function(users) {
                var client = 0;
                $.each(users, function(i, user) {
                    if (user.client != "client") {
                        Clients[user.client] = {
                            pk: user.client,
                            mail: user.mailclient,
                            users: []
                        };
                    }
                    
                    Clients[user.client].users.push({
                        login: user.login,
                        mail: user.mail
                    });
                });
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
            $.each(Clients, function(i, client) {
                $("#list-clients-tokens")
                .append(
                    $("<li></li>")
                    .attr("data-pk", client.pk)
                    .html("<b>" + client.pk + "</b> : "+ client.mail)
                    .click(toggle_client_tokens)
                );
            });
            break;
        case "messages":
            
            break;
        case "activate":
            
            break;
        case "moulinette":
            
            break;
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
            200: function(cadeaux) {
                $.each(cadeaux, function(i, cadeau) {
                    $("#list-tokens-clients")
                    .append(
                        $("<li></li>")
                        .html("Un cadeau")
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
