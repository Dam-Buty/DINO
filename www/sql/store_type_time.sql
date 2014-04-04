# Store : type de document (time)
INSERT INTO `type_doc_document` (
    `fk_type_doc`, 
    `fk_categorie_doc`, 
    `fk_champ`, 
    `fk_monde`, 
    `fk_client`, 
    `fk_document`, 
    `detail_type_doc`, 
    `revision_type_doc`
) VALUES (
    :type, 
    :categorie, 
    :champ, 
    :monde, 
    :client, 
    :filename, 
    :detail, 
    (
        SELECT COALESCE(MAX(`revision_type_doc`) + 1, 1) 
        FROM (
            SELECT `revision_type_doc` 
            FROM 
                `type_doc_document` AS `tdd`,
                `document` AS `d`
            WHERE 
                `d`.`fk_client` = :dClient
                AND `d`.`filename_document` = `tdd`.`fk_document`
            
                AND `tdd`.`fk_client` = :tddClient
                AND `tdd`.`fk_monde` = :tddMonde
                AND `tdd`.`fk_categorie_doc` = :tddCategorie
                AND `tdd`.`fk_type_doc` = :tddType 
                
                AND `tdd`.`detail_type_doc` = :tddDetail
                
                AND (
                    SELECT COUNT(*) 
                    FROM `document_valeur_champ` AS `dvc` 
                    WHERE `dvc`.`fk_client` = :dvcClient
                        AND `dvc`.`fk_monde` = :dvcMonde
                        AND `dvc`.`fk_champ` = :dvcChamp
                        AND `dvc`.`fk_valeur_champ` = :dvcValeur
                        AND `dvc`.`fk_document` = `tdd`.`fk_document`
                    ) > 0
                    
                AND LEFT(
                    `d`.`date_document` * 1, 6
                ) = :time
        ) AS `magic_revision` 
    )
)
;
