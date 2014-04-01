# Sauvegarde de monde : ajout du monde
INSERT INTO `monde` (
    `label_monde`,
    `fk_client`
) VALUES (
    :label,
    :client
)
;
