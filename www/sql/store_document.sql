# Store : document
UPDATE `document` 
SET 
    niveau_document = 0, 
    date_document = :date
WHERE `filename_document` = :filename ;
