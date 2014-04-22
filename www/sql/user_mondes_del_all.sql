# Suppression de tous les droits d un user (mondes)
DELETE FROM `user_monde`
WHERE 
    `fk_client` = :client
    AND `fk_user` = :login
;
