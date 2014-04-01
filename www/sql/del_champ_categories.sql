# Efface champ 1/4 : select categories
SELECT `pk_categorie_doc`
FROM `categorie_doc`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
;
