# Del monde : del categories
DELETE FROM `monde`
WHERE
    `fk_client` = :client
    AND `pk_monde` = :monde
;
