
$(document).ready(function() {
    $("#form-login").submit(function() {
        var login, password;
        login = $("#login").val();
        password = $("#pass").val();        
        
        $("input").removeClass("KO");
        
        if (login == "") {
            $("#login").addClass("KO");
            $("#login").focus();
        } else {
            if (password == "") {
                $("#pass").addClass("KO");
                $("#pass").focus();
            } else {
                $("#container-login").hide();
                $("#container-loading").show();
                $.ajax({
                    url: "do/doLogin.php",
                    type: "POST",
                    data: {
                        login: $("#login").val(),
                        password: $("#pass").val()
                    },
                    statusCode: {
                        200: function() {
                            window.location.replace("index.php");
                        },
                        403: function(retour) {
                            if (retour.responseJSON.error == "login") {
                                $("#login").addClass("KO");
                            }
                            if (retour.responseJSON.error == "pass") {
                                $("#pass").addClass("KO");
                            }
                            if (retour.responseJSON.error == "activate") {
                                popup_activate();
                            }
                            $("#container-login").show();
                            $("#container-loading").hide();
                        },
                        500: function() {
                            $("#login").addClass("KO");
                            $("#pass").addClass("KO");
                            $("#container-login").show();
                            $("#container-loading").hide();
                        }
                    }
                }); 
            }
        }
        
        return false;    
    });
    
    var subdomain = location.hostname.split(".").shift();
    
    // Si on est sur un sous domaine de visiteurs, on auto login
    if (subdomain != "baby" && subdomain != "my") {
        $("#container-login").hide();
        $("#container-loading").show();
        $("#login").val(subdomain);
        $("#pass").val(subdomain);
        $('input[type="submit"]').click();
    }
});
