# Verification de l existence d un client par son mail
SELECT
    `pk_client` AS `pk`,
    `activation_client` AS `activation`
FROM `client`
WHERE
    `mail_client` = :mail
;
