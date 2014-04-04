# Activation 1/2 : vérif de la clef
SELECT `login_user`
FROM `user`
WHERE 
    `mail_user` = :mail
    AND `activation_user` = :activation
;
