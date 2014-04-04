# Profil : récupération des valeurs d un champ
SELECT `pk_valeur_champ`, 
    `label_valeur_champ`, 
    `fk_parent`, ( 
        SELECT COUNT(*) 
        FROM `user_valeur_champ` AS `uvc` 
        WHERE `uvc`.`fk_client` = :client
        AND `uvc`.`fk_monde` = :monde
        AND `uvc`.`fk_champ` = :champ
        AND `uvc`.`fk_user` = :user
        AND `uvc`.`fk_valeur_champ` = `vc`.`pk_valeur_champ`
    ) AS `droits_valeur_champ` 
FROM `valeur_champ` AS `vc` 
WHERE `fk_client` = :client1
    AND `fk_monde` = :monde1
    AND `fk_champ` = :champ1
ORDER BY 
    `droits_valeur_champ` DESC,
    `fk_parent` ASC,
    `label_valeur_champ` ASC
;
