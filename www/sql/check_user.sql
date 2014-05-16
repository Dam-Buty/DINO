# Verification de l existence d un user pour un client
SELECT
    `login_user`
FROM `user`
WHERE
    `fk_client` = :client
;
