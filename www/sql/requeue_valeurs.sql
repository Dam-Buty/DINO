# Requeue : valeurs 3/3
DELETE FROM `document_valeur_champ`
WHERE 
    `fk_client` = :client
    AND `fk_document` = :filename ;
