# Profil : récupération des catégories
SELECT 
    `pk_categorie_doc`, 
    `label_categorie_doc`, 
    `niveau_categorie_doc`, 
    `time_categorie_doc` 
FROM `categorie_doc` 
WHERE 
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `niveau_categorie_doc` <= :niveau ;
