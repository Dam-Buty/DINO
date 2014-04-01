# Get users : select les mondes associés à un user
SELECT 
    `pk_monde`, 
    `niveau_monde`,
    (
        SELECT COUNT(*)
        FROM `user_monde` AS `um`
        WHERE 
            `um`.`fk_user` = :user
            AND `um`.`fk_monde` = `pk_monde`
    ) AS `droit`
FROM `monde`
WHERE 
    `fk_client` = :client
    AND (
        SELECT COUNT(*)
        FROM `user_monde` AS `um`
        WHERE 
            `um`.`fk_user` = :user2
            AND `um`.`fk_monde` = `pk_monde`
    ) = 1;
