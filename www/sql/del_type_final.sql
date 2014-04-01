# Efface type 4/4 : supprime type de doc
DELETE FROM `type_doc`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `fk_categorie_doc` = :categorie
    AND `pk_type_doc` = :pk
;
