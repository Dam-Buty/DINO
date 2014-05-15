# Signup : client
INSERT INTO `client` (
    `mail_client`,
    `inscription_client`,
    `activation_client`
) VALUES (
    :mail,
    NOW(),
    :key
);
