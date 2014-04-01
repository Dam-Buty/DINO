# Del valeur OK
DELETE FROM `valeur_champ`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND ((
            `fk_champ` = :champ
            AND `pk_valeur_champ` = :pk
            AND `fk_parent` = :parent
        )
        OR `fk_parent` = :fkParent
    )
;
