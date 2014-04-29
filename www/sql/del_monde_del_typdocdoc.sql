# Del monde : del associations types de doc
DELETE FROM `type_doc_document`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
;
