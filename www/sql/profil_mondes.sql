# Profil : récupération des mondes
SELECT 
    `pk_monde`, 
    `label_monde`,
    `niveau_monde`
FROM `monde` AS `m`
WHERE 
    `fk_client` = :client
    AND (
        SELECT COUNT(*)
        FROM `user_monde` AS `um`
        WHERE 
            `um`.`fk_client` = `m`.`fk_client`
            AND `um`.`fk_user` = :user
            AND `um`.`fk_monde` = `m`.`pk_monde`
    )
;
