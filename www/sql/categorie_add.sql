# Ajout catégorie
INSERT INTO `categorie_doc` (
    `label_categorie_doc`, 
    `niveau_categorie_doc`,
    `time_categorie_doc`,
    `fk_champ`, 
    `fk_monde`, 
    `fk_client`
) VALUES (
    :categorie,
    :niveau,
    :time,
    :champ,
    :monde,
    :client
)
;
