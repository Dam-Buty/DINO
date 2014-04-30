# Superadmin : recupere liste des users plus infos sur les clients
SELECT
    `login_user`,
    `mail_user`,
    `pk_client`,
    `mail_client`,
    `inscription_client`,
    `contact_client`,
    (`activation_user` = '') as `activated`,
    (`niveau_user` >= 30) as `gestionnaire`,
    (`inscription_client` >= NOW() - INTERVAL 3 DAY) as `recent`
FROM 
    `user`,
    `client`
WHERE
    `fk_client` = `pk_client`
ORDER BY
    `pk_client` DESC,
    `login_user` ASC
;
