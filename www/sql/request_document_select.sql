# Request document 1/2
SELECT 
    `filename_document`, 
    `display_document`, 
    `taille_document`, 
    DATE(`date_upload_document`) AS `date_doc`, 
    `fk_user` 
FROM `document` 
WHERE 
    `fk_client` = :client
    AND `niveau_document` = 999
LIMIT 1
;
