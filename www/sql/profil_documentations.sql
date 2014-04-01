# Profil : récupération documentations
SELECT 
    `pk_documentation`, 
    `titre_documentation`, 
    `niveau_documentation`, 
    `url_documentation`
FROM `documentation`
WHERE
    `niveau_documentation` <= :niveau
ORDER BY
    `pk_documentation` ASC
