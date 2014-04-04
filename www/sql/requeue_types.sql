# Requeue : types 2/3
DELETE FROM `type_doc_document`
WHERE 
    `fk_client` = :client
    AND `fk_document` = :filename ;
