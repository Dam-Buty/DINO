# Ajoute user
INSERT INTO `user`
(
    `login_user`, 
    `mdp_user`, 
    `mail_user`, 
    `niveau_user`,
    `activation_user`, 
    `clef_user`, 
    `fk_client`, 
    `fk_token`
) VALUES (
    :login, 
    :password, 
    :mail, 
    :niveau, 
    :activation, 
    :clef,
    :client,
    :token
);
