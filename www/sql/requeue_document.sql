# Requeue : document 1/3
UPDATE `document`
SET `niveau_document` = NULL
WHERE 
    `fk_client` = :client
    AND `filename_document` = :filename ;
