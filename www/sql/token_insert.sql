# Insert Token
INSERT INTO `token` (
    `date_token`,
    `quantite_token`,
    `expire_token`,
    `fk_produit`,
    `fk_combo`,
    `fk_client`
) VALUES (
    NOW(),
    :quantite,
    :expire,
    :produit,
    :combo,
    :client
);
