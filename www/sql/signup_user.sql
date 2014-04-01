# Signup : user
INSERT INTO `user` (
    `login_user`, 
    `mdp_user`, 
    `mail_user`, 
    `niveau_user`, 
    `fk_client`, 
    `clef_user`,
    `activation_user`
) VALUES (
    :login, 
    :password, 
    :mail, 
    30, 
    :idclient, 
    :clef,
    :activation
);
