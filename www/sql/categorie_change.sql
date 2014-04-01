# Modif categorie
UPDATE `categorie_doc`
SET 
    `label_categorie_doc` = :categorie,
    `niveau_categorie_doc` = :niveau
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `pk_categorie_doc` = :pk
;
