# Profil : récupération des tokens
SELECT 
    `pk_token`, 
    `quantite_token`, 
    `expire_token`,  
    `fk_produit`,
    `used_token`,
    (`expire_token` < NOW()) as `expired`,
    `paid_token`
FROM `token`
WHERE
    `fk_client` = :client
    AND `expired_token` = 0
ORDER BY `paid_token` ASC
;
