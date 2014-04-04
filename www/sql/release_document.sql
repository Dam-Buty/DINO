# Release document
UPDATE `document`
SET
    `niveau_document` = NULL
WHERE 
    `fk_client` = " .  . "
    AND `filename_document` = '" .  . "'
;
