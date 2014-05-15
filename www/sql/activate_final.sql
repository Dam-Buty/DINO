# Activation OK
UPDATE `client`
SET `activated_client` = 1
WHERE
    `pk_client` = :pk
;
