# Del valeur OK
DELETE FROM `valeur_champ`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND (
        `pk_valeur_champ` = :pk
        OR `fk_parent` = :fkParent
    )
;
