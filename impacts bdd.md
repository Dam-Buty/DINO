
BABEL
======

Renommer tous les documents en .dino !
>> pas oublier quand on supprime un doc de supprimer le -pdf!
sudo find . -name "*.css" -exec rename -v 's/\.css$/\.dino/i' {} \;
---- OK sur BABY, 

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

