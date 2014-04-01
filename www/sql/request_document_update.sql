# Request document OK
UPDATE `document`
SET
    `niveau_document` = 888
WHERE 
    `fk_client` = :client
    AND `filename_document` = :filename
;
