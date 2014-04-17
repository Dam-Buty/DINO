# Insert Token
INSERT INTO `token` (
    `date_token`,
    `quantite_token`,
    `expire_token`,
    `cadeau_token`,
    `fk_produit`,
    `fk_client`
) VALUES (
    NOW(),
    :qte,
    NOW() + INTERVAL :mois MONTH,
    1,
    :produit,
    :client
);
