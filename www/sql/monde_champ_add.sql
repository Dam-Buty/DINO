# Sauvegarde de monde : ajout de champ
INSERT INTO `champ` (
    `label_champ`,
    `pluriel_champ`,
    `fk_monde`,
    `fk_client`
) VALUES (
    :label,
    :pluriel,
    :monde,
    :client
)
;
