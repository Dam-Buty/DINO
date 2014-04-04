# Efface champ 2/4 : select types
SELECT `pk_type_doc`
FROM `type_doc`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `fk_categorie_doc` = 0
;
