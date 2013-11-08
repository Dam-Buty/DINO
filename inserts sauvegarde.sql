INSERT INTO `categorie_doc` (`pk_categorie_doc`, `label_categorie_doc`, `niveau_categorie_doc`, `fk_champ`, `fk_monde`, `fk_client`) VALUES
(6, 'Operativo', 0, 6, 1, 82),
(7, 'Contable', 0, 6, 1, 82),
(8, 'Control', 0, 6, 1, 82),
(9, 'Contratos', 20, 7, 2, 82);
INSERT INTO `champ` (`pk_champ`, `label_champ`, `pluriel_champ`, `fk_monde`, `fk_client`) VALUES
(5, 'Cliente', 'Clientes', 1, 82),
(6, 'Operacion', 'Operaciones', 1, 82),
(7, 'Provedor', 'Provedores', 2, 82);
INSERT INTO `client` (`pk_client`, `entreprise_client`, `mail_client`, `nom_contact_client`, `poste_contact_client`, `phone_contact_client`, `ext_contact_client`, `nb_emp_client`, `nb_op_client`, `nb_douanes_client`, `credit_client`, `statut_client`, `bucket_client`, `call_me_maybe`) VALUES
(82, 'Correo Solucion', 'dam.buty@gmail.com', 'Chad Warwick', 'Gerente TI', '33612421620', '', 0, 0, 0, '10000', 0, 0, 0);
INSERT INTO `document` (`filename_document`, `display_document`, `niveau_document`, `date_document`, `date_upload_document`, `fk_user`, `fk_client`) VALUES
('gRtgPZhwkmtf.pdf', 'FACT_001.pdf', NULL, NULL, '2013-11-07 17:26:27', 'test.dam', 82);
INSERT INTO `monde` (`pk_monde`, `label_monde`, `niveau_monde`, `fk_client`) VALUES
(1, 'Operativo', 10, 82),
(2, 'Provedores', 20, 82);
INSERT INTO `type_doc` (`pk_type_doc`, `label_type_doc`, `detail_type_doc`, `niveau_type_doc`, `fk_categorie_doc`, `fk_champ`, `fk_monde`, `fk_client`) VALUES
(23, 'Acuerdo anual', 0, 20, 0, 5, 1, 82),
(24, 'Contrato', 1, 10, 0, 5, 1, 82),
(25, 'Pedimento', 0, 0, 0, 6, 1, 82),
(26, 'Cotizacion', 0, 0, 6, 6, 1, 82),
(27, 'BL', 0, 0, 6, 6, 1, 82),
(28, 'Declaracion de valor', 0, 0, 6, 6, 1, 82),
(29, 'Cuenta de gastos', 0, 0, 7, 6, 1, 82),
(30, 'Derechos aduaneros', 0, 0, 7, 6, 1, 82),
(31, 'Factura', 1, 10, 7, 6, 1, 82),
(32, 'Fotografia', 1, 0, 8, 6, 1, 82),
(33, 'Recibo', 1, 10, 8, 6, 1, 82),
(34, 'Acuerdo anual', 0, 30, 0, 7, 2, 82),
(35, 'Contrato', 1, 20, 9, 7, 2, 82);
INSERT INTO `user` (`login_user`, `mdp_user`, `mail_user`, `niveau_user`, `clef_user`, `fk_client`) VALUES
('LeSuperAdminEstUnBatard', '9eac9bcd3f660d49b7c96ff8583e4b218bc70008', 'dam.buty@gmail.com', 999, '', 0),
('test.dam', 'ac86ff68126d5b03c41fd1b816273bb3d06f16340ef27e7e617c83e3c419254f', 'dam.buty@gmail.com', 30, 'tQY3Q/7PVUWoZhsM4wc37WcbAznnXDK+rSo1xMrXIHInQv593uBLunQRE2WPL1GiQCc8m6SaXp6TLtB89XpNFQ==', 82);
INSERT INTO `valeur_champ` (`pk_valeur_champ`, `label_valeur_champ`, `fk_champ`, `fk_monde`, `fk_client`) VALUES
(3, 'Samsung', 5, 1, 82),
(2, 'Google', 5, 1, 82),
(1, 'Apple', 5, 1, 82),
(4, 'Fender', 5, 1, 82),
(5, 'Marshall', 5, 1, 82),
(6, 'ElectroHarmonix', 5, 1, 82),
(1, 'FBI', 7, 2, 82),
(2, 'NSA', 7, 2, 82),
(3, 'KGB', 7, 2, 82),
(4, 'CIA', 7, 2, 82),
(5, 'Playschool', 7, 2, 82);
