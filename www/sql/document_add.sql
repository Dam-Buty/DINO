# Ajoute document
INSERT INTO `document` (
    `filename_document`, 
    `taille_document`, 
    `display_document`, 
    `fk_client`, 
    `fk_user`, 
    `date_upload_document`
) VALUES (
    :filename, 
    :taille, 
    :display, 
    :client, 
    :user, 
    :date
);
