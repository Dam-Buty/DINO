
var Image = {
    x: 0,
    y: 0,
    r: 0  
};

$(".document-img").load(function() {
    var img = $(".document-img")[0];    
    Image.x = img.naturalWidth;
    Image.y = img.naturalHeight;
    Image.r = Image.x / Image.y;
    
    resize_img();
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
        x__ = 0.95 * (x_ * Math.min(y_/(y * ( x_ / x) ), 1));
        y__ = x__ / r;
    }
    
    img.css({
        width: x__,
        height: y__
    });
};
