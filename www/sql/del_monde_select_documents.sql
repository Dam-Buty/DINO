# Suppression de monde : recuperation des documents concernes
SELECT `filename_document` FROM `document` AS `d`
WHERE (
	SELECT COUNT(*) FROM `type_doc_document` AS `tdd`
    WHERE 
        `tdd`.`fk_document` = `d`.`filename_document`
        AND `tdd`.`fk_client` = :client
        AND `tdd`.`fk_monde` = :monde
) > 0
