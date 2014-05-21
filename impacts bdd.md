
KEYMASTER
=========

client :
+ + clef_client

VORTEX
======

client:
+ + activated_client
+ + inscription_client
+ + activation_client
+ + uploaded_client

user:
+ + nom_user

APOCALYPSE
==========

monde:
+ + demande_suppr_monde

client:
+ + inscription_client

supprimer tuto 5

ILLUMINATI
==========

>> Donner tous les tokens des users actuels!
>> créer le token 0 pour les requêtes jointures!
>> créer le superadmin
````sql
INSERT INTO `token` (`pk_token`, `quantite_token`, `expire_token`, `date_token`, `expired_token`, `used_token`, `cadeau_token`, `paid_token`, `fk_produit`, `fk_combo`, `fk_client`) VALUES
(0, 9999, '2115-02-10', '2014-04-02', 0, 0, 1, 1, 0, 0, 0);
INSERT INTO `user` (`login_user`, `mdp_user`, `mail_user`, `niveau_user`, `activation_user`, `clef_user`, `public_user`, `fk_client`, `fk_token`, `expired_user`) VALUES
('LeSuperAdminEstUnBatard', '31fe02d98a1578ca8c02a1edf4db3e47b86961e3c3bf2363b96e023753d31a31', 'dam.buty@gmail.com', 999, '', '262IV2ij5LncVHZochC4BPkPgW5enQYXB7Q+VF7uj4PzTC9r4RoZhts354h31eqqHi9rq+OSmZZk1/UD9EdJfw==', 0, 176, 0, 0);

````

combo:
+ + pk_combo
+ + label_combo

produit:
+ + pk_produit
+ + label_produit

token:
+ + pk_token
+ + quantite_token
+ + expire_token
+ + date_token
+ + expired_token
+ + used_token
+ + cadeau_token
+ + paid_token
+ + fk_produit
+ + fk_combo
+ + fk_client

monde:
+ + fk_token
+ + expired_monde

user:
+ + fk_token
+ + expired_user

client:
+ + contact_client

>> OK sur baby, OK sur my 

BABEL
======

Renommer tous les documents en .dino !
>> pas oublier quand on supprime un doc de supprimer le -pdf!
sudo find . -name "*.css" -exec rename -v 's/\.css$/\.dino/i' {} \;
---- OK sur BABY, MY

Libre office command line :
- Java framework pb : créer un dossier nommé var/www/.config/libreoffice et le chowner sur le user apache2
---- OK sur BABY, MY

client:
+ + convert_client
---- OK sur BABY, MY

TEMPLAR
=======

Remettre les tuto et user_tuto à niveau pour ajout du nouveau n°1

````sql
UPDATE `user_tuto`
SET
	`fk_tuto` = `fk_tuto` + 1
WHERE
	`fk_tuto` != 0 
ORDER BY `fk_tuto` DESC;
UPDATE `tuto`
SET
	`pk_tuto` = `pk_tuto` + 1
WHERE
	`pk_tuto` != 0
ORDER BY `pk_tuto` DESC;
````

WOODSTOCK
=========

Déploiement :

Créer le dossier log, le chowner sur correosolucion:psaserv


MARK
====

client:
+ + branded_client

user:
+ + public_user

OK sur baby, OK sur my

ACTIVATE
========

user:
+ + activation_user

OK sur baby, OK sur my

SIGNUP
======

client:
+ + secteur_client (VARCHAR 50)
- - nom_contact_client
- - poste_contact_client
- - phone_contact_client
- - ext_contact_client
- - nb_emp_client
- - nb_op_client
- - nb_douanes_client
- - credit_client
- - bucket_client
- - call_me_maybe
- - statut_client

user:
- - tuto_user
- - permanent_tuto_user
- - help_user

demande : supprimé

tuto:
+ + pk_tuto (INT)
+ + titre_tuto (VARCHAR 50)
+ + niveau_tuto (INT)

user_tuto:
+ + fk_tuto (INT)
+ + fk_user (VARCHAR 32)

documentation:
+ + pk_documentation (INT)
+ + titre_documentation (VARCHAR 50)
+ + url_documentation (VARCHAR 100)
+ + niveau_documentation (INT)

OK sur baby, OK sur my


Cabinet
=======

demande:
+ + pk_demande
+ + monde_demande
+ + critere_demande
+ + documents_demande
+ + fk_user
+ + fk_client

OK sur baby OK sur my

Timeworlds
==========

categorie_doc:
+ + time_categorie_doc (BOOL)

type_doc:
+ + time_type_doc (BOOL)

OK sur baby OK sur my

