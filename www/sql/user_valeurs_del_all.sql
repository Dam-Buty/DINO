# Suppression de tous les droits d un user (valeurs)
DELETE FROM `user_valeur_champ`
WHERE 
    `fk_client` = :client
    AND `fk_user` = :login
;
