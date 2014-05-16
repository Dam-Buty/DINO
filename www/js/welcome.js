
var blurred = false;

var blur = function() {
    if (!blurred) {
        blurred = true;
        html2canvas($("body"), {
            onrendered: function (canvas) {
                $("#no-touchy-feely").append(canvas);
                $("canvas").attr("id", "canvas");
                stackBlurCanvasRGB(
                    'canvas',
                    0,
                    0,
                    $("canvas").width(),
                    $("canvas").height(),
                    5
                );
            }
        });
    }
};

var params = {};

$(document).ready(function(){
    $("#lien-pass").click(toggle_pass);
    $("#pass-submit").click(create_user);
    $("#info-submit").click(infos);
    
    $("#pass").keyup(check_pass_welcome).change(check_pass_welcome);
    $("#pass2").keyup(check_pass2_welcome).change(check_pass2_welcome);
    
    $("#front").fadeIn(function() {
        $("body").append(
            $("<div></div>")
            .attr("id", "no-touchy-feely")
            .css({
                "overflow-y": "hidden"
            })
        );

        var popup;
        
        var get = location.search.split("?")[1].split("&");
        
        $.each(get, function(i, param) {
            var elements = param.split("=");
            params[elements[0]] = decodeURIComponent(elements[1]);
        });
        
        mixpanel.identify(params.mail);
        
        switch(params.action) {
            case "signup":
                blur();
                $("#popup-welcome-activate").fadeIn();
                mixpanel.people.set({
                    "$email": params.mail,
                    "$created": new Date()
                });
                mixpanel.track("signup", {});
                break;
            case "activate":
                blur();
                activate();
                break;
            case "token":
                $("body").mousemove(function() {
                    $("#popup-welcome-token").fadeIn();
                });
                break;
        };
    });
});


var activate = function() {
    $("#container-loading").fadeIn();
    
    $.ajax({
        url: "do/doActivate.php",
        type: "POST",
        data: {
            key: params.key,
            mail: params.mail
        },
        statusCode: {
            200: function() {
                $("#popup-welcome-security").fadeIn();
                mixpanel.track("activate", {});
            },
            204: function() {
                $("#container-loading").hide();
                $("#container-KO").show();
                mixpanel.track("signup-error-key", {});
            },
            500: function() {
                $("#container-loading").hide();
                $("#container-KO").show();
                mixpanel.track("signup-error-interne", {});
            }
        }
    }); 
};

var toggle_pass = function() {
    $("#lien-pass").slideUp();
    $("#sermon").slideUp(function() {
        $("#pass-form").slideDown();
    });
};

var create_user = function() {
    var pass = $("#pass");
    var pass2 = $("#pass2");
    
    if (pass.hasClass("OK")) {
        if (pass2.hasClass("OK")) {
            $.ajax({
                url: "do/doSignupUser.php",
                type: "POST",
                data: {
                    mail: params.mail,
                    pass: pass.val(),
                    client: params.pk
                },
                statusCode: {
                    200: function(data) {
                        mixpanel.track("password", {});
                        $("#popup-welcome-security").hide();
                        $("#popup-welcome-info").show();
                    },
                    500: function() {
                        $("#popup-welcome-security").hide();
                        $("#container-KO-pass").show();
                    }
                }
            });
        } else {
            pass2.focus();
        }
    } else {
        pass.focus();
    }
};

var check_pass_welcome = function() {
    var jauge = $("#popup-welcome-security .popup-jauge");
    var field = $(this);
    var pass = field.val();
    var nb_chars = pass.length;
    var strength = Math.min(nb_chars * 10, 80);
    
    jauge.removeAttr("class").addClass("popup-jauge").addClass("jauge-KO");
    field.removeClass("OK");
    
    if (nb_chars < 8) {
        $("#pass-length").addClass("pass-error");
    } else {
        $("#pass-length").removeClass("pass-error");
    }
    
    if (countContain(pass, m_strUpperCase) == 0) {
        $("#pass-maj").addClass("pass-error");
    } else {
        $("#pass-maj").removeClass("pass-error");
    }
    
    if (countContain(pass, m_strLowerCase) == 0) {
        $("#pass-min").addClass("pass-error");
    } else {
        $("#pass-min").removeClass("pass-error"); 
    }
    
    if (countContain(pass, m_strNumber) == 0) {
        $("#pass-num").addClass("pass-error");
    } else {
        $("#pass-num").removeClass("pass-error");
    }
    
    if (countContain(pass, m_strUpperCase) > 0 && countContain(pass, m_strLowerCase) > 0 && countContain(pass, m_strNumber) > 0) {
        strength += 10;
    }
    
    if (countContain(pass, m_strCharacters) == 0) {
        $("#pass-char").addClass("pass-error");
    } else {
        strength += 10;
        $("#pass-char").removeClass("pass-error");
    }
    
    if (strength == 100) {
        field.addClass("OK");
        jauge.removeClass("jauge-KO");
    }
    
    jauge.addClass("jauge-" + strength);
};

var check_pass2_welcome = function() {
    var field = $(this);
    var pass, pass2;
    
    pass = $("#pass").val();
    pass2 = field.val();
    
    if (pass.length == 0) {
        field.removeClass("OK").removeClass("KO");  
    } else {
        if (pass2 != pass.substring(0, pass2.length)) {
            field.removeClass("OK").addClass("KO");  
        } else {
            if (pass == pass2) {
                field.removeClass("KO").addClass("OK");    
            } else {
                field.removeClass("OK").removeClass("KO");  
            }
        }
    }
};  

var infos = function() {
    var nom = $("#nom");
    var entreprise = $("#entreprise");

    if (nom.val() == "") {
        nom.focus();
    } else {
        if (entreprise.val() == "") {
            entreprise.focus();
        } else {
            $.ajax({
                url: "do/doInfoUser.php",
                type: "POST",
                data: {
                    nom: nom.val(),
                    entreprise: entreprise.val(),
                    client: params.pk,
                    mail: params.mail
                },
                statusCode: {
                    200: function(data) {
                        mixpanel.people.set({
                            "$name": nom.val(),
                            "company": entreprise.val()
                        }, function() {
                            mixpanel.track("information", {}, function() {
                                window.location.replace("index.php");
                            });
                        });
                    },
                    500: function() {
                        $("#popup-welcome-info").hide();
                        $("#container-KO-info").show();
                    }
                }
            });
        }
    }
};
