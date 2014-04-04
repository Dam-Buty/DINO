# Sauvegarde d user : suppression des droits préalables
DELETE FROM `user_valeur_champ`
WHERE 
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` =  :champ
    AND `fk_user` = :login ;
