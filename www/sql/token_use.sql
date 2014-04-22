# Consomme un token
UPDATE `token`
SET `used_token` = 1
WHERE `pk_token` = :pk
;
