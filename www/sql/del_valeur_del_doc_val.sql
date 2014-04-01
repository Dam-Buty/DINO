# Del valeur 3/6 : Del Document-Valeur
DELETE FROM `document_valeur_champ`
WHERE 
    `fk_client` = :client
    AND `fk_document` = :filename
;
