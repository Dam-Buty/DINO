# Del monde : del associations user monde
DELETE FROM `user_monde`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
;
