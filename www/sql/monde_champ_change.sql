# Sauvegarde de monde : modification de champ
UPDATE `champ`
SET
    `label_champ` = :label,
    `pluriel_champ` = :pluriel
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `pk_champ` = :pk
;
