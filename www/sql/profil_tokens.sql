# Profil : récupération des tokens
SELECT 
    `pk_token`, 
    `quantite_token`, 
    `expire_token`,  
    `fk_produit`,
    `cible_token`,
    (`expire_token` < NOW()) as `expired`
FROM `token`
WHERE
    `fk_client` = :client
    AND `expired_token` = 0
;
