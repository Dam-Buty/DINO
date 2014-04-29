# Del monde : del champs
DELETE FROM `champ`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
;
