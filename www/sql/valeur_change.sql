# Modifie valeur
UPDATE `valeur_champ`
SET 
    `label_valeur_champ` = :label
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `pk_valeur_champ` = :pk
;
