# Sauvegarde d user : injection des droits valeurs champs
INSERT INTO `user_valeur_champ`
(`fk_client`, `fk_monde`, `fk_champ`, `fk_user`, `fk_valeur_champ`) 
VALUES (
    :client,
    :monde,
    :champ,
    :login,
    :valeur
);                  
