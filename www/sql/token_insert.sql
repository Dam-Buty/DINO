# Insert Token
INSERT INTO `token` (
    `date_token`,
    `quantite_token`,
    `expire_token`,
    `paid_token`,
    `fk_produit`,
    `fk_combo`,
    `fk_client`
) VALUES (
    NOW(),
    :quantite,
    :expire,
    :paid,
    :produit,
    :combo,
    :client
);
