# Store : valeur de champ
INSERT INTO `document_valeur_champ` (
    `fk_document`, 
    `fk_monde`, 
    `fk_client`, 
    `fk_valeur_champ`, 
    `fk_champ`
) VALUES (
    :filename, 
    :monde, 
    :client, 
    :valeur, 
    :pk
);
