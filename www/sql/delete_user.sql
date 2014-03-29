# Suppression utilisateur
DELETE FROM `user`
WHERE
    `fk_client` = :client
    AND `niveau_user` <= :niveau
    AND `login_user` = :login
;
