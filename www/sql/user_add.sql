# Ajoute user
INSERT INTO `user`
(
    `login_user`, 
    `mdp_user`, 
    `mail_user`, 
    `niveau_user`, 
    `fk_client`, 
    `activation_user`, 
    `clef_user`
) VALUES (
    :login, 
    :password, 
    :mail, 
    :niveau, 
    :client, 
    :activation,
    :clef
);
