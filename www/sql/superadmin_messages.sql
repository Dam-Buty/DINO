# Superadmin : recupere liste des messages
SELECT
    `pk_message`,
    `titre_message`,
    `html_message`
FROM 
    `message`
ORDER BY
    `pk_message` ASC
;
