# Efface type 1/4 : déclassifie documents 
UPDATE `document`
SET
    `niveau_document` = NULL,
    `date_document` = NULL
WHERE
    `fk_client` = :client1
    AND (
        SELECT COUNT(`fk_document`)
        FROM `type_doc_document`
        WHERE
            `fk_client` = :client2
            AND `fk_monde` = :monde
            AND `fk_champ` = :champ
            AND `fk_categorie_doc` = :categorie
            AND `fk_type_doc` = :pk
            AND `fk_document` = `filename_document`
    ) > 0
;
