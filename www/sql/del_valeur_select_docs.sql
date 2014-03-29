# Del valeur 1/6 : select documents
SELECT `filename_document`
FROM `document` AS `d`, `document_valeur_champ` AS `dvc`
WHERE
    `d`.`fk_client` = :dClient
    
    AND `dvc`.`fk_client` = :dvcClient
    AND `dvc`.`fk_monde` = :monde
    AND `dvc`.`fk_champ` = :champ
    AND `dvc`.`fk_valeur_champ` = :pk
    
    AND `dvc`.`fk_document` = `d`.`filename_document`
;
