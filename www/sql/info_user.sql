# Sauvegarde infos user
UPDATE `user`
SET
    `nom_user` = :nom
WHERE
    `fk_client` = :client
    AND `mail_user` = :mail
;
