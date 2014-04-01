# Login
SELECT 
    `mail_user`, 
    `mdp_user`, 
    `clef_user`, 
    `niveau_user`, 
    `activation_user` 
FROM `user` 
WHERE 
    `login_user` = :login ;
