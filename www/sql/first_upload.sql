# Declare le premier upload
UPDATE `client`
SET `uploaded_client` = 1
WHERE `pk_client` = :client
;
