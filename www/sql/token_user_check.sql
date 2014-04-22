# Verifie la validite d un token
SELECT 
    (`fk_produit` = 2) AS `visitor`
FROM `token`
WHERE
    `pk_token` = :pk
    AND `expire_token` > NOW()
    AND `expired_token` = 0
    AND `used_token` = 0
    AND `paid_token` = 1
    AND (
        `fk_produit` = 1
        OR `fk_produit` = 2
    )
;
