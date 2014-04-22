# Expire un monde
UPDATE `monde`
SET `expired_monde` = 1
WHERE `fk_token` = :pk
