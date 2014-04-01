# Profil : recupération des types
SELECT 
    `pk_type_doc`, 
    `label_type_doc`, 
    `detail_type_doc`, 
    `niveau_type_doc`,
    `time_type_doc`
FROM `type_doc` 
WHERE 
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `fk_categorie_doc` = :categorie
    AND `niveau_type_doc` <= :niveau;
