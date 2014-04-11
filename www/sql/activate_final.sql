# Activation OK
UPDATE `user`
SET `activation_user` = ''
WHERE
    `login_user` = :login
;
