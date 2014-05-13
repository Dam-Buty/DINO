
var blurred = false;

var blur = function() {if (!blurred) {
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
};

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
    var params = {};
    
    $.each(get, function(i, param) {
        var elements = param.split("=");
        params[elements[0]] = elements[1];
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
                window.location.replace("index.php?activated");
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
