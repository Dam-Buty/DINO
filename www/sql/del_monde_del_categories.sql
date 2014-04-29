# Del monde : del categories
DELETE FROM `categorie_doc`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
;
