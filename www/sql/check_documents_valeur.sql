# Vérifie si des documents sont associés à une valeur de champ
SELECT `filename_document`
FROM `document` AS `d`, `document_valeur_champ` AS `dvc`
WHERE 
    `d`.`fk_client` = :dClient
    
    AND `dvc`.`fk_client` = :dvcClient
    AND `dvc`.`fk_monde` = :monde
    AND `dvc`.`fk_champ` = :champ
    AND `dvc`.`fk_valeur_champ` = :pk
    
    AND `d`.`filename_document` = `dvc`.`fk_document`
;
