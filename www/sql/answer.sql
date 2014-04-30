# Contact commercial
UPDATE `client`
SET `contact_client` = 0
WHERE `pk_client` = :client
;
