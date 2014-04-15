# Expire un token
UPDATE `token`
SET `expired_token` = 1
WHERE `pk_token` = :pk
