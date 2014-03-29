#Changement de mail OK
UPDATE `user`
SET
    `mail_user` = :mail,
    `clef_user` = :clef
WHERE
    `login_user` = :login
