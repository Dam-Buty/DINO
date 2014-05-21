# Login
SELECT 
    `mail_user`, 
    `mdp_user`, 
    `clef_user`, 
    `niveau_user`, 
    `activation_user`,
    `expired_user`,
    `user`.`fk_client` AS `client`,
    `pk_token`,
    `expired_token`,
    (`expire_token` < NOW()) AS `hasExpired`
FROM `user`, `token`
WHERE 
    `fk_token` = `pk_token`
    AND `login_user` = :login ;
