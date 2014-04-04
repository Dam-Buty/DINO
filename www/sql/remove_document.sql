# Remove document
DELETE FROM `document` 
WHERE `filename_document` = :filename
;
