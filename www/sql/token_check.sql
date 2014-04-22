# Verifie la validite d un token
SELECT `pk_token`
FROM `token`
WHERE
    `pk_token` = :pk
    AND `expire_token` < NOW()
    AND `expired_token` = 0
    AND `cible_token` = 0
    AND `paid_token` = 1
    AND `fk_produit` = :produit
;
