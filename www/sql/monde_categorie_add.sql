# Sauvegarde de monde : ajout de categorie
INSERT INTO `categorie_doc` (
    `label_categorie_doc`,
    `niveau_categorie_doc`,
    `fk_champ`,
    `fk_monde`,
    `fk_client`
) VALUES (
    :label,
    :niveau,
    :champ,
    :monde,
    :client
)
;
