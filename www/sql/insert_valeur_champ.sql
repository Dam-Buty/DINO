# Ajout valeur de champ
INSERT INTO `valeur_champ` (
    `fk_client`, 
    `fk_monde`, 
    `fk_champ`, 
    `fk_parent`, 
    `label_valeur_champ`
) VALUES (
    :client, 
    :monde, 
    :champ, 
    :parent, 
    :valeur
);
