# Compte les documents avant suppression
SELECT
    COUNT(*) AS `docs`,
    SUM(`taille_document`) AS `space`
FROM
    `document` AS `d`,
    `type_doc_document` AS `tdd`
WHERE
    `d`.`fk_client` = `tdd`.`fk_client`
    AND `d`.`filename_document` = `tdd`.`fk_document`
    AND `tdd`.`fk_monde` = :monde
;
