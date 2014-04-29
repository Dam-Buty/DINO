# Del monde : del associations doc valeur
DELETE FROM `document_valeur_champ`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
;
