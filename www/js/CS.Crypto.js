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
    console.log("Stockage : " + clef_stockage);
    console.log("User : " + clef_user);
    return CryptoJS.AES.encrypt(clef_stockage, clef_user);
};

// Renvoie une chaine de 88 octets
var custom_hash = function(password) {
    return CryptoJS.SHA512(password).toString(CryptoJS.enc.Base64);
};
