# Activation 1/2 : vérif de la clef
SELECT `login_user`, `activation_user`
FROM `user`
WHERE 
    `login_user` = :login
    AND `mail_user` = :mail
;
