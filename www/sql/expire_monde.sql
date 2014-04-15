# Expire un monde
UPDATE `monde`
SET `expired_monde` = 1
WHERE `pk_monde` = :pk
