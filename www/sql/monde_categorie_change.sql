# Sauvegarde de monde : modification de categorie
UPDATE `categorie_doc`
SET
    `label_categorie_doc` = :label,
    `niveau_categorie_doc` = :niveau
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `pk_categorie_doc` = :pk
;
