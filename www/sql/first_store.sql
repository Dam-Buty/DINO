# Declare le premier upload
UPDATE `client`
SET `stored_client` = 1
WHERE `pk_client` = :client
;
