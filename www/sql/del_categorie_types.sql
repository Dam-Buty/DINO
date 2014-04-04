# Efface categorie 1/2 : select types associés
SELECT `pk_type_doc`
FROM `type_doc`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `fk_champ` = :champ
    AND `fk_categorie_doc` = :pk
;
