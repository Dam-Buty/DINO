# Profil: récupération des tutos
SELECT 
    `pk_tuto`, 
    `titre_tuto`, 
    `niveau_tuto`,
    ( 
        SELECT COUNT(*)
        FROM `user_tuto`
        WHERE
            `fk_user` = :user
            AND `fk_tuto` = `pk_tuto`
    ) AS `done`
FROM `tuto`
WHERE
    `niveau_tuto` <= :niveau
ORDER BY
    `pk_tuto` ASC
;
    
