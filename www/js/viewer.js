
var Image = {
    x: 0,
    y: 0,
    r: 0  
};

$(".document-img").ready(function() {
    setTimeout(function(){
        var img = $(".document-img");    
        Image.x = img.width();
        Image.y = img.height();
        Image.r = Image.x / Image.y;
        
        resize_img();
    }, 400);
}); 

$(window).resize(function() {
    resize_img();
});

resize_img = function() {
    var img = $(".document-img"); 
    var x = Image.x;
    var y = Image.y;
    var r = Image.r;
    
    var x_ = $(window).innerWidth();
    var y_ = $(window).innerHeight();
    
    var x__ = x;
    var y__ = y;
    
    if (x > x_ || y > y_) {
        x__ = 0.90 * (x_ * Math.min(y_/(y * ( x_ / x) ), 1));
        y__ = x__ / r;
    }
    
    img.css({
        width: x__,
        height: y__
    });
};
