# SEARCH
SELECT 
    `d`.`filename_document` AS `filename`, 
    `d`.`display_document` AS `display`,
    DATE_FORMAT(`d`.`date_document`, '%d/%m/%Y') AS `date`,
    `td`.`fk_categorie_doc` AS `categorie`,
    `td`.`pk_type_doc` AS `type`,
    `tdd`.`detail_type_doc` AS `detail`,
    `tdd`.`revision_type_doc` AS `revision`,
    ( 
        SELECT GROUP_CONCAT( `fk_valeur_champ` SEPARATOR '||' )
        FROM 
            `document_valeur_champ` AS `dvc`
        WHERE 
            `dvc`.`fk_client` = :dvcClient
            AND `dvc`.`fk_monde` = :dvcMonde
            
            AND `dvc`.`fk_document` = `d`.`filename_document`
        ORDER BY `dvc`.`fk_champ`
    ) AS `champs`,
    ( 
        SELECT GROUP_CONCAT( `label_valeur_champ` SEPARATOR '||' )
        FROM 
            `valeur_champ` AS `vc_labels`,
            `document_valeur_champ` AS `dvc_labels`
        WHERE 
            `dvc_labels`.`fk_client` = :dvc1Client
            AND `dvc_labels`.`fk_monde` = :dvc1Monde
            AND `vc_labels`.`fk_client` = :vc1Client
            AND `vc_labels`.`fk_monde` = :vc1Monde
            
            AND `vc_labels`.`fk_champ` = `dvc_labels`.`fk_champ`
            AND `vc_labels`.`pk_valeur_champ` = `dvc_labels`.`fk_valeur_champ`
            
            AND `dvc_labels`.`fk_document` = `d`.`filename_document`
        ORDER BY `vc_labels`.`fk_champ`
    ) AS `labels`,
    ( `td`.`time_type_doc` * `d`.`date_document`) AS `time`
FROM 
    `type_doc` AS `td`,
    `type_doc_document` AS `tdd`,
    `document` AS `d`
WHERE
    # Filtre client/monde
    `td`.`fk_client` = :tdClient
    AND `td`.`fk_monde` = :tdMonde
    AND `tdd`.`fk_client` = :tddClient
    AND `tdd`.`fk_monde` = :tddMonde
    AND `d`.`fk_client` = :dClient

    # Jointures
    AND `td`.`fk_champ` = `tdd`.`fk_champ`
    AND `td`.`fk_categorie_doc` = `tdd`.`fk_categorie_doc`
    AND `td`.`pk_type_doc` = `tdd`.`fk_type_doc`
    AND `tdd`.`fk_document` = `d`.`filename_document`
        
    # Verification du niveau
    AND `niveau_document` <= :niveauDoc
    AND `td`.`niveau_type_doc` <= :niveauType
    AND ( (
        SELECT `niveau_categorie_doc`
        FROM `categorie_doc` AS `cdNiveau`
        WHERE
            `cdNiveau`.`fk_client` = `td`.`fk_client`
            AND `cdNiveau`.`fk_monde` = `td`.`fk_monde`
            AND `cdNiveau`.`fk_champ` = `td`.`fk_champ`
            AND `cdNiveau`.`pk_categorie_doc` = `td`.`fk_categorie_doc`
    ) <= :niveauCategorie OR (
        SELECT COUNT(`niveau_categorie_doc`)
        FROM `categorie_doc` AS `cdNiveau2`
        WHERE
            `cdNiveau2`.`fk_client` = `td`.`fk_client`
            AND `cdNiveau2`.`fk_monde` = `td`.`fk_monde`
            AND `cdNiveau2`.`fk_champ` = `td`.`fk_champ`
            AND `cdNiveau2`.`pk_categorie_doc` = `td`.`fk_categorie_doc`
    ) = 0 )
    
    # On ne prend que les documents auxquels il a droit 
    AND ( (
        SELECT COUNT(*)
        FROM `document_valeur_champ` AS `dvc_droits`
        WHERE 
            `dvc_droits`.`fk_client` = :droitsClient
            AND `dvc_droits`.`fk_monde` = :droitsMonde
            
            AND `dvc_droits`.`fk_valeur_champ` IN (0%droitsValeurs%)
                
            AND `dvc_droits`.`fk_document` = `d`.`filename_document`
    ) > 0  OR 
        1 = :all_droits
    )
    
    # Filtre par dates
    AND `date_document` BETWEEN FROM_UNIXTIME(:mini) AND FROM_UNIXTIME(:maxi)
    
    # Recherche
    AND (( 
        SELECT COUNT(*)
        FROM `document_valeur_champ` AS `dvc_search`
        WHERE
            `dvc_search`.`fk_client` = :searchClient
            AND `dvc_search`.`fk_monde` = :searchMonde
            
            AND `dvc_search`.`fk_document` = `d`.`filename_document`
            
            AND `dvc_search`.`fk_valeur_champ` IN (0%search%)
    ) > 0  OR 
        1 = :no_search
    )
    
    # Tris
    # - Par labels de champs concaténés
    # - Par time ASC
    # - Par date DESC
    # - Par catégorie ASC, type ASC, détail ASC
    ORDER BY 
        `labels` ASC, 
        `td`.`time_type_doc` ASC, 
        LEFT(`time`, 6) DESC, 
        (
            SELECT `label_categorie_doc`
            FROM `categorie_doc` AS `cd`
            WHERE 
                `cd`.`fk_client` = :cdClient
                AND `cd`.`fk_monde` = :cdMonde
                AND `cd`.`pk_categorie_doc` = `td`.`fk_categorie_doc`
        ) ASC, 
        `td`.`label_type_doc` ASC, 
        `tdd`.`detail_type_doc` ASC,
        `tdd`.`revision_type_doc` DESC

    # Limites    
    LIMIT 0, 500
