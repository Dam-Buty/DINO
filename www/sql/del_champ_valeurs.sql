# Efface champ 3/4 : efface valeurs du champ types
DELETE FROM `valeur_champ`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
;
