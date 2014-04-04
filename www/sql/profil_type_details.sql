# Profil: récupération des détails d un type
SELECT DISTINCT(`detail_type_doc`) 
FROM `type_doc_document` 
WHERE 
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `fk_categorie_doc` = :categorie
    AND `fk_type_doc` = :type
ORDER BY `detail_type_doc`;
