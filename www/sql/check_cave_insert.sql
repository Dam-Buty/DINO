# Ajoute document décavé
INSERT INTO `document` (
    `filename_document`, 
    `job_document`,
    `taille_document`, 
    `display_document`, 
    `fk_client`, 
    `fk_user`, 
    `date_upload_document`,
    `niveau_document`
) VALUES (
    :filename, 
    :job,
    :taille, 
    :display, 
    :client, 
    :user, 
    :date,
    999
)
;
