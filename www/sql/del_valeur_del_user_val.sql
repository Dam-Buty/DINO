# Del valeur 5/6 : Del User-Val
DELETE FROM `user_valeur_champ`
WHERE   
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `fk_valeur_champ` = :pk
;
