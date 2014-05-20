# Sauvegarde infos user
UPDATE `user`
SET
    `nom_user` = :nom
WHERE
    `fk_client` = :client
    AND `login_user` = :mail
;
