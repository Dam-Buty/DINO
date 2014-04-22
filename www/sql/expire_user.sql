# Expire un user
UPDATE `user`
SET `expired_user` = 1
WHERE `fk_token` = :pk
