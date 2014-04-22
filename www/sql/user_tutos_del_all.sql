# # Suppression de tous les droits d un user (tutos)
DELETE FROM `user_tuto`
WHERE 
    `fk_user` = :login
;
