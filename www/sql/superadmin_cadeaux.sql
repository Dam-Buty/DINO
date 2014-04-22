# Superadmin : recupere les cadeaux et achats du client
SELECT
    `pk_token`,
    `quantite_token`,
    `expire_token`,
    `date_token`,
    `expired_token`,
    `used_token` AS `used`,
    `cadeau_token`,
    `fk_produit`,
    `fk_combo`
FROM 
    `token`
WHERE 
    `fk_client` = :client
ORDER BY
    `cadeau_token` ASC,
    `paid_token` ASC,
    `fk_combo` DESC,
    `expired_token` ASC,
    `used` DESC,
    `fk_produit` ASC,
    `date_token` ASC
;
