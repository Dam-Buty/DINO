# Modifie user
UPDATE `user`
SET
    `niveau_user` = :niveau
WHERE `login_user` = :login
;
