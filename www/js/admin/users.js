
var bootstrap_users = function() {
    $.ajax({
        url: "json/users.php",
        statusCode: {            
            200: function(users) {
                $.each(users, function(i, user) {
                     
                });
            },
            403: function() {
                window.location.replace("index.php");
            },
            500: function() {
                popup('Error de recuperacion de datos. Gracias por intentar otra vez', 'error'); // LOCALISATION
            }
        }   
    });
    
    $("#add-user").unbind().click(toggle_new_user);
    
    $("#new-user").find("#niveau").chosen({
        width: $("#new-login").outerWidth(),
        disable_search_threshold: 10
    });
    
    $("#form-new-user").validationEngine("attach", {
        promptPosition : "centerRight",
        checkuser: {
            url: "do/doCheckLogin.php",
            extraDataDynamic: ["#new-login"],
            alertText: "El nombre de usuario" + $("#new-login").val() + " ya esta ocupado!",
            alertTextOk: $("#new-login").val() + " es un excelente nombre!"
            alertTextLoad: "Revisando..."
        }
    });
};

var toggle_new_user = function() {
    if ($("#new-user").is(":visible")) {
        
    } else {
        $("#new-user").slideDown();
    }
};
