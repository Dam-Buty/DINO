# Del monde : del associations user valeur
DELETE FROM `user_valeur_champ`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
;
