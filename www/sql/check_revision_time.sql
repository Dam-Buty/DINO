# Check révision time
SELECT `revision_type_doc`
FROM 
    `type_doc_document` AS `tdd`,
    `document` AS `d`
WHERE `tdd`.`fk_client` = :client 
    AND `tdd`.`fk_monde` = :monde
    
    AND `tdd`.`fk_client` = `d`.`fk_client`
    AND `tdd`.`fk_document` = `d`.`filename_document`
    
    AND `tdd`.`fk_categorie_doc` = :categorie
    AND `tdd`.`fk_type_doc` = :type 
    AND `tdd`.`detail_type_doc` = :detail
    
    AND (
        SELECT COUNT(*) 
        FROM `document_valeur_champ` AS `dvc` 
        WHERE `dvc`.`fk_client` = :dvcClient
            AND `dvc`.`fk_monde` = :dvcMonde
            AND `dvc`.`fk_champ` = :dvcPk
            AND `dvc`.`fk_valeur_champ` = :dvcValeur
            AND `dvc`.`fk_document` = `tdd`.`fk_document`
    ) > 0
    
    AND LEFT(
        `d`.`date_document` * 1, 6
    ) = :time
;
