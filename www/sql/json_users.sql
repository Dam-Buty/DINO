# Get users
SELECT 
    `login_user`, 
    `mail_user`, 
    `niveau_user` 
FROM `user` 
WHERE 
    `fk_client` = :client
    AND `niveau_user` < :niveau
ORDER BY `login_user`
;
