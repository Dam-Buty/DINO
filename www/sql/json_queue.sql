# Get queue
SELECT 
    `filename_document`, 
    `display_document`, 
    `taille_document`, 
    DATE(`date_upload_document`) AS `date_doc`, 
    `fk_user` 
FROM `document` 
WHERE 
    `fk_client` = :client
    AND `niveau_document` IS NULL
    AND (
        `fk_user` = :user
        OR 20 <= :niveau
    )
ORDER BY `display_document` ASC
;
