# Del monde : del valeurs de champs
DELETE FROM `valeur_champ`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
;
