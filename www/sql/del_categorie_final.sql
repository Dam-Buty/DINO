# Efface catégorie OK
DELETE FROM `categorie_doc`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `pk_categorie_doc` = :pk
;
