# Efface champ OK
DELETE FROM `champ`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
    AND `pk_champ` = :champ
;
