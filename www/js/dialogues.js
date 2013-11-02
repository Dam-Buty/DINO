
var popup = function(message, type) {
    
    new $.Zebra_Dialog(
        message, {
        'type': type,
        'buttons':  false,
        'modal': false,
        'width': Math.floor($(window).width() * 0.3),
        'position': ['right - 20', 'top + 20'],
        'auto_close': 3000
    });
};
