# Profil : récupération des champs
SELECT 
    `pk_champ`, 
    `label_champ`, 
    `pluriel_champ` 
FROM `champ` 
WHERE 
    `fk_client` = :client 
    AND `fk_monde` = :monde 
ORDER BY `pk_champ` ASC
;
