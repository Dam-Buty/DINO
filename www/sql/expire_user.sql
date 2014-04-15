# Expire un user
UPDATE `user`
SET `expired_user` = 1
WHERE `login_user` = :pk
