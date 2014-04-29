# Demande de suppression de monde
UPDATE `monde`
    SET `demande_suppr_monde` = :lemode
WHERE
    `fk_client` = :client
    AND `pk_monde` = :monde
;
