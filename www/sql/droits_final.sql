# Injection des droits OK
INSERT INTO `user_monde` (
    `fk_client`,
    `fk_monde`,
    `fk_user`
) VALUES (
    :client,
    :monde,
    :login
)
;
