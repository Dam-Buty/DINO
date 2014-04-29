# Del monde : del types de doc
DELETE FROM `type_doc`
WHERE
    `fk_client` = :client
    AND `fk_monde` = :monde
;
