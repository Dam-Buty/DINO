# Marquer un tuto comme vu
INSERT IGNORE INTO `user_tuto` (
    `fk_user`,
    `fk_tuto`
) VALUES (
    :user,
    :tuto
)
;
