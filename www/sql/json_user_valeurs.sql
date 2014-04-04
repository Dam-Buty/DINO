# Get users : select les valeurs de champs associées à un user
SELECT `fk_valeur_champ` 
FROM `user_valeur_champ`
WHERE 
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_user` = :user
