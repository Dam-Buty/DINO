# Signup : client
INSERT INTO `client` (
    `mail_client`,
    `inscription_client`
) VALUES (
    :mail,
    NOW()
);
