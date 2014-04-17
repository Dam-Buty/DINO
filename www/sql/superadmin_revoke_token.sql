# Revoke Token
DELETE FROM `token`
WHERE `pk_token` = :pk
;
