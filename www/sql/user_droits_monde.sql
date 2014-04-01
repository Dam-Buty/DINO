# Sauvegarde d user : injection des droits à un monde
INSERT INTO `user_monde`
(`fk_client`, `fk_monde`, `fk_user`) 
VALUES (
    :client,
    :monde,
    :login
)
;
