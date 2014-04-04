# Key user
UPDATE `user`
SET 
    `mdp_user` = :pass,
    `clef_user` = :clef
WHERE
    `fk_client` = :client
    AND `niveau_user` <= :niveau
    AND `login_user` = :login
;
