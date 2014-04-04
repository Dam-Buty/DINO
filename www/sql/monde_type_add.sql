# Sauvegarde de monde : ajout de type
INSERT INTO `type_doc` (
    `label_type_doc`,
    `detail_type_doc`,
    `niveau_type_doc`,
    `time_type_doc`,
    `fk_categorie_doc`,
    `fk_champ`,
    `fk_monde`,
    `fk_client`
) VALUES (
    :label,
    :detail,
    :niveau,
    :time,
    :categorie,
    :champ,
    :monde,
    :client
)
;
