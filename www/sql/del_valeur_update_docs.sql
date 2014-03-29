# Del valeur 4/6 : Déclassifie documents
UPDATE `document`
SET `niveau_document` = NULL
WHERE 
    `fk_client` = :client
    AND `filename_document` = :filename
;
