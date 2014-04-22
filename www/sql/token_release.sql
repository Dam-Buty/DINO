# Libere un token
UPDATE `token`
SET `used_token` = 0
WHERE `pk_token` = :pk
;
