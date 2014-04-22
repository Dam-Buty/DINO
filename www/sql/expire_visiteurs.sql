# Expire les visiteurs d un client
UPDATE `user`
SET `expired_user` = 1
WHERE `niveau_user` = 0
    AND `fk_client` = :client
    AND `fk_token` != 0
;
