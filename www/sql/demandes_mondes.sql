# Superadmin : recuperation des demandes de suppression de mondes
SELECT
    `pk_monde`,
    `label_monde`,
    `demande_suppr_monde`
FROM `monde`
WHERE
    `fk_client` = :client
    AND `demande_suppr_monde` != ""
;
