# Modifie user
UPDATE `user`
SET
    `niveau_user` = :niveau,
    `fk_token` = :token
WHERE `login_user` = :login
;
