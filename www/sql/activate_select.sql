# Activation 1/2 : vérif de la clef
SELECT `pk_client`
FROM `client`
WHERE 
    `activation_client` = :key
    AND `mail_client` = :mail
;
