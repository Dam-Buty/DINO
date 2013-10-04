///////////////////////////////////
/* CS Crypto                     */
/*                               */
/* The crypto magic happens HERE */
/* - v 0.1                       */
///////////////////////////////////

// Génère une chaine aléatoire de n caractères
var random_string = function(n) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789-=~!@#$%&*()_+,.<>?;:[]{}|";

    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

// Génère une passphrase de n octets et la crypte selon le login, pass et mail
var genere_clef = function(n, login, password, mail) {
    var clef_user = custom_hash(login + password + mail);
    var clef_stockage = random_string(n);
    return CryptoJS.AES.encrypt(clef_stockage, clef_user);
};

// Renvoie une chaine de 88 octets
var custom_hash = function(password) {
    return CryptoJS.SHA3(password).toString(CryptoJS.enc.Base64);
};

var decrypte_clef = function(clef_cryptee, clef_user) {
    return CryptoJS.AES.decrypt(clef_cryptee, clef_user).toString(CryptoJS.enc.Utf8);
};
