# Profil : infos client / user
SELECT 
    `niveau_user`, 
    `public_user`, 
    `fk_client`, 
    `printer_client`, 
    `convert_client`,
    `entreprise_client`, 
    `branded_client` 
FROM 
    `user`, 
    `client` 
WHERE 
    `pk_client` = `fk_client` 
    AND `login_user` = :login ;
