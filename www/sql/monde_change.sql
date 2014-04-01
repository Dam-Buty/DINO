# Sauvegarde de monde : modification du monde
UPDATE `monde`
SET `label_monde` = :label
WHERE 
    `fk_client` = :client
    AND `pk_monde` = :pk
;
