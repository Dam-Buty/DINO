# Insert Token
INSERT INTO `token` (
    `quantite_token`,
    `expire_token`,
    `fk_produit`,
    `fk_combo`,
    `fk_client`
) VALUES (
    :quantite,
    :expire,
    :produit,
    :combo,
    :client
);
