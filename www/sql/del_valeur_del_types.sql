# Del valeur 2/6 : Del types
DELETE FROM `type_doc_document`
WHERE 
    `fk_client` = :client
    AND `fk_document` = :filename
;
