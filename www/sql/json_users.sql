# Get users
SELECT 
    `login_user`, 
    `mail_user`, 
    `niveau_user`,
    `fk_token`
FROM `user` 
WHERE 
    `fk_client` = :client
    AND `niveau_user` < :niveau
ORDER BY `login_user`
;
