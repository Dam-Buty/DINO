# Sauvegarde d user : supprime les droits préalables à des mondes
DELETE FROM `user_monde`
WHERE 
    `fk_client` = :client
    AND `fk_user` = :login
    AND `fk_monde` IN (%droits%)
;
