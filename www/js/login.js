
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
                        }
                    }
                }); 
            }
        }
        
        return false;    
    });
});
