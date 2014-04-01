# Injection des droits 1/2 : selection des users
SELECT `login_user`
FROM `user`
WHERE
    `fk_client` = :client
    AND (
        `login_user` = :login
        OR `niveau_user` = 30
    )
;
