# Ajout valeur champ
INSERT INTO `valeur_champ` (
    `label_valeur_champ`, 
    `fk_champ`, 
    `fk_monde`, 
    `fk_client`, 
    `fk_parent`
) VALUES (
    :label,
    :champ,
    :monde,
    :client,
    :parent
)
;
