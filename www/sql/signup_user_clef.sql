# Signup user : stocke la clef dans le client
UPDATE `client`
SET
    `clef_client` = :clef
WHERE
    `pk_client` = :client
;
