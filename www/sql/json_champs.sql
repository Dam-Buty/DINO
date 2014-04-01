# Get champs
SELECT 
    `pk_valeur_champ`, 
    `label_valeur_champ` 
FROM `valeur_champ` 
WHERE 
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_parent` = :parent
    AND `fk_champ` = :champ
;
