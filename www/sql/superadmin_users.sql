# Superadmin : récupère liste des users plus infos sur les clients
SELECT
    `login_user`,
    `mail_user`,
    `pk_client`,
    `mail_client`
FROM 
    `user`,
    `client`
WHERE
    `fk_client` = `pk_client`
ORDER BY
    `pk_client` DESC,
    `login_user` ASC
;
