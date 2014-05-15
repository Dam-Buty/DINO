# Sauvegarde infos client
UPDATE `client`
SET
    `entreprise_client` = :entreprise
WHERE
    `pk_client` = :client
;
