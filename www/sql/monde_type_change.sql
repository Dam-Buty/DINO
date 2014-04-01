# Sauvegarde de monde : modification de type
UPDATE `type_doc`
SET
    `label_type_doc` = :label,
    `detail_type_doc` = :detail,
    `niveau_type_doc` = :niveau,
    `time_type_doc` = :time
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `fk_categorie_doc` = :categorie
    AND `pk_type_doc` = :pk
;
