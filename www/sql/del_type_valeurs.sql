# Efface type 2/4 : supprime associations valeurs champs
DELETE  `dvc` 
FROM  `document_valeur_champ` AS  `dvc` 
WHERE
    `dvc`.`fk_client` = :client1
    AND `dvc`.`fk_monde` = :monde1
    AND (
        SELECT COUNT(`tdd`.`fk_document`)
        FROM `type_doc_document` AS `tdd`
        WHERE
            `tdd`.`fk_client` = :client2
            AND `tdd`.`fk_monde` = :monde2
            AND `tdd`.`fk_champ` = :champ
            AND `tdd`.`fk_categorie_doc` = :categorie
            AND `tdd`.`fk_type_doc` = :pk
            AND `tdd`.`fk_document` = `dvc`.`fk_document`
    ) > 0
;
