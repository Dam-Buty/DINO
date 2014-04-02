# Récupère la liste des révisions (time)
SELECT `fk_document`, `revision_type_doc`, 
    DATE_FORMAT(`d`.`date_document`, '%d/%m/%Y') AS `date`,
    `d`.`display_document` AS `display`
FROM `type_doc_document` AS `tdd`, `document` AS `d`
WHERE 
    # Jointure
    `d`.`fk_client` = `tdd`.`fk_client`
    AND `d`.`filename_document` = `tdd`.`fk_document`
    
    # Selection des documents de meme categorie, type, detail
    AND `tdd`.`fk_client` = :client
    AND `tdd`.`fk_monde` = :monde
    AND `tdd`.`fk_champ` = :champ
    AND `tdd`.`fk_categorie_doc` = :categorie
    AND `tdd`.`fk_type_doc` = :type
    AND `tdd`.`detail_type_doc` = :detail
    
    # Elimination du document quon recherche
    AND `tdd`.`fk_document` != :filename
    
    # Selection des documents ayant le meme dernier champ
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
ORDER BY `revision_type_doc` ASC
;
