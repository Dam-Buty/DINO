<?php

// Hash SHA256
function custom_hash($clef, $b64 = FALSE) {
    return hash("sha256", $clef, !$b64);
}

// Génération d'une chaine de n caractères au hasard
// Si alpha = TRUE on n'utilise que des lettres et des chiffres
function genere_clef($n, $alpha = FALSE) {
    if ($alpha) {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    } else {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789-=~!@#$%&*()_+,.<>?;:[]{}|";
    }
    
    $alphaLength = strlen($alphabet) - 1;
    
    // Génération de la clef de sécurité du client.
    $clef = "";

    for ($i = 1; $i <= $n;$i++) {
        $k = rand(0, $alphaLength);
        $clef .= $alphabet[$k];
    }
    
    return $clef;
}

function crypte($key, $input) {
    $td = mcrypt_module_open('rijndael-256', '', 'cbc', '');
    $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
    mcrypt_generic_init($td, $key, $iv);
    $encrypted_data = mcrypt_generic($td, $input);
    $retour = $iv . $encrypted_data;
    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);

    return base64_encode($retour);
}

function decrypte($key, $input) {
    $td = mcrypt_module_open('rijndael-256', '', 'cbc', '');
    
    $input = base64_decode($input);
    
    $iv = substr($input, 0, mcrypt_enc_get_iv_size($td));
    $data = substr($input, mcrypt_enc_get_iv_size($td));
    
    mcrypt_generic_init($td, $key, $iv);
    $retour = mdecrypt_generic($td, $data);
    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);
    
    return $retour;
}
?>
