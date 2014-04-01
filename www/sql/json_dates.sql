# Get dates
SELECT 
    DATE_FORMAT(
        MAX(`document`.`date_document`),
        '%Y-%m-%d'
    ) as `max`, 
    DATE_FORMAT(
        MIN(`document`.`date_document`),
        '%Y-%m-%d'
    ) as `min`
FROM `document`, `type_doc_document` 
WHERE 
    `type_doc_document`.`fk_document` = `document`.`filename_document`
    AND `document`.`fk_client` = :client
    AND `type_doc_document`.`fk_monde` = :monde;
