# Efface type 3/4 : Supprime associations types de docs
DELETE FROM `type_doc_document`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `fk_categorie_doc` = :categorie
    AND `fk_type_doc` = :pk
;
