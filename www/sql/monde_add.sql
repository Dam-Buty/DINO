# Sauvegarde de monde : ajout du monde
INSERT INTO `monde` (
    `label_monde`,
    `fk_client`,
    `fk_token`
) VALUES (
    :label,
    :client,
    :token
)
;
