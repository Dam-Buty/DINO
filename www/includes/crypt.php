<?php
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
    $input = base64_decode($input);
    
    $iv = substr($input, 0, 8);
    $data = substr($input, 8);  
    
    $td = mcrypt_module_open('rijndael-256', '', 'cbc', '');
    
    mcrypt_generic_init($td, $key, $iv);        
    $retour = mdecrypt_generic($td, $data);        
    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);
    
    return $retour;
}
?>
