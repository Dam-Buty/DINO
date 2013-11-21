-- phpMyAdmin SQL Dump
-- version 4.0.8
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Mer 20 Novembre 2013 à 18:58
-- Version du serveur: 5.5.34-0ubuntu0.13.10.1
-- Version de PHP: 5.5.3-1ubuntu2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `csstorage2`
--

-- --------------------------------------------------------

--
-- Structure de la table `categorie_doc`
--

CREATE TABLE IF NOT EXISTS `categorie_doc` (
  `pk_categorie_doc` int(11) NOT NULL AUTO_INCREMENT,
  `label_categorie_doc` varchar(50) NOT NULL,
  `niveau_categorie_doc` int(11) DEFAULT NULL,
  `fk_champ` int(11) NOT NULL,
  `fk_monde` int(11) NOT NULL,
  `fk_client` int(11) NOT NULL,
  PRIMARY KEY (`pk_categorie_doc`,`fk_champ`,`fk_monde`,`fk_client`),
  KEY `fk_categorie_doc_champ1_idx` (`fk_champ`,`fk_monde`,`fk_client`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Contenu de la table `categorie_doc`
--

INSERT INTO `categorie_doc` (`pk_categorie_doc`, `label_categorie_doc`, `niveau_categorie_doc`, `fk_champ`, `fk_monde`, `fk_client`) VALUES
(6, 'Operativo', 0, 6, 1, 82),
(7, 'Contable', 0, 6, 1, 82),
(8, 'Control', 0, 6, 1, 82),
(9, 'Contratos', 20, 7, 2, 82);

-- --------------------------------------------------------

--
-- Structure de la table `champ`
--

CREATE TABLE IF NOT EXISTS `champ` (
  `pk_champ` int(11) NOT NULL AUTO_INCREMENT,
  `label_champ` varchar(100) NOT NULL,
  `pluriel_champ` varchar(50) NOT NULL,
  `fk_monde` int(11) NOT NULL,
  `fk_client` int(11) NOT NULL,
  PRIMARY KEY (`pk_champ`,`fk_monde`,`fk_client`),
  KEY `fk_champ_monde1_idx` (`fk_monde`,`fk_client`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Contenu de la table `champ`
--

INSERT INTO `champ` (`pk_champ`, `label_champ`, `pluriel_champ`, `fk_monde`, `fk_client`) VALUES
(5, 'Cliente', 'Clientes', 1, 82),
(6, 'Operacion', 'Operaciones', 1, 82),
(7, 'Provedor', 'Provedores', 2, 82);

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE IF NOT EXISTS `client` (
  `pk_client` int(11) NOT NULL AUTO_INCREMENT,
  `entreprise_client` varchar(50) NOT NULL,
  `mail_client` varchar(100) NOT NULL,
  `nom_contact_client` varchar(50) NOT NULL,
  `poste_contact_client` varchar(50) NOT NULL,
  `phone_contact_client` varchar(50) NOT NULL,
  `ext_contact_client` varchar(10) NOT NULL,
  `nb_emp_client` int(11) NOT NULL,
  `nb_op_client` int(11) NOT NULL,
  `nb_douanes_client` int(11) NOT NULL,
  `credit_client` varchar(100) NOT NULL,
  `statut_client` int(11) NOT NULL,
  `bucket_client` int(11) NOT NULL,
  `call_me_maybe` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pk_client`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=83 ;

--
-- Contenu de la table `client`
--

INSERT INTO `client` (`pk_client`, `entreprise_client`, `mail_client`, `nom_contact_client`, `poste_contact_client`, `phone_contact_client`, `ext_contact_client`, `nb_emp_client`, `nb_op_client`, `nb_douanes_client`, `credit_client`, `statut_client`, `bucket_client`, `call_me_maybe`) VALUES
(82, 'Correo Solucion', 'dam.buty@gmail.com', 'Chad Warwick', 'Gerente TI', '33612421620', '', 0, 0, 0, '10000', 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `coupon`
--

CREATE TABLE IF NOT EXISTS `coupon` (
  `coupon` varchar(20) NOT NULL,
  `credits` int(11) NOT NULL,
  PRIMARY KEY (`coupon`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `coupon_client`
--

CREATE TABLE IF NOT EXISTS `coupon_client` (
  `fk_coupon` varchar(20) NOT NULL,
  `fk_client` int(11) NOT NULL,
  `date_coupon_client` datetime DEFAULT NULL,
  PRIMARY KEY (`fk_coupon`,`fk_client`),
  KEY `fk_coupon_client_client1` (`fk_client`),
  KEY `fk_coupon_client_coupon1` (`fk_coupon`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `document`
--

CREATE TABLE IF NOT EXISTS `document` (
  `filename_document` varchar(100) NOT NULL,
  `display_document` varchar(100) NOT NULL,
  `niveau_document` varchar(45) DEFAULT NULL,
  `date_document` datetime DEFAULT NULL,
  `date_upload_document` datetime DEFAULT NULL,
  `fk_user` varchar(32) NOT NULL,
  `fk_client` int(11) NOT NULL,
  PRIMARY KEY (`filename_document`,`fk_client`),
  KEY `fk_document_user1` (`fk_user`,`fk_client`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `document`
--

INSERT INTO `document` (`filename_document`, `display_document`, `niveau_document`, `date_document`, `date_upload_document`, `fk_user`, `fk_client`) VALUES
('0qJJRuzlIqgD.pdf', 'MEXICO.pdf', '10', '2013-11-20 00:00:00', '2013-11-15 20:26:25', 'test.dam', 82),
('6pzeOKJOeTJf.pdf', 'La brume dans la maison.pdf', '10', '2013-04-15 00:00:00', '2013-11-15 19:03:57', 'test.dam', 82),
('AHSknB8cw6io.pdf', 'Accord3.pdf', '10', '2013-11-19 00:00:00', '2013-11-19 10:20:11', 'test.dam', 82),
('BzF9arS6ldM8.pdf', 'Chroniques de la fin dun monde.pdf', '10', '2013-04-17 00:00:00', '2013-11-15 19:03:56', 'test.dam', 82),
('cGmiAe9abrdW.pdf', '10 jours, 10 heures, 10 minutes.pdf', '10', '2013-04-25 00:00:00', '2013-11-15 19:03:56', 'test.dam', 82),
('DL5EZGhsF0u5.pdf', 'La brume dans la maison.pdf', '10', '2013-11-05 00:00:00', '2013-11-18 12:29:01', 'test.dam', 82),
('F2TQ5YsHdtif.pdf', 'MEXICO.pdf', '10', '2013-04-25 00:00:00', '2013-11-15 19:03:59', 'test.dam', 82),
('fG767tTA9MUr.pdf', 'Accord3.pdf', '10', '2013-11-13 00:00:00', '2013-11-18 10:35:58', 'test.dam', 82),
('h7G5hpXgQq8j.pdf', 'Accord2.pdf', '10', '2013-11-06 00:00:00', '2013-11-18 12:17:02', 'test.dam', 82),
('hbmPiUMaml4o.pdf', 'Cult-final-with-cover-11a1.pdf', '10', '2013-11-11 00:00:00', '2013-11-15 20:26:22', 'test.dam', 82),
('hGSazQ9tLhXO.pdf', 'Chroniques de la fin dun monde.pdf', '10', '2013-11-11 00:00:00', '2013-11-15 20:26:22', 'test.dam', 82),
('HSSckcfMlnXN.pdf', 'La brume dans la maison.pdf', '10', '2013-11-11 00:00:00', '2013-11-15 20:26:22', 'test.dam', 82),
('I3f4FSmUK7kz.pdf', 'Accord3.pdf', '10', '2013-11-06 00:00:00', '2013-11-18 12:17:02', 'test.dam', 82),
('IjlBB7rMTY3Z.pdf', 'Drugs, dogs ans Chinese conspiracy.pdf', '10', '2013-04-25 00:00:00', '2013-11-15 19:03:57', 'test.dam', 82),
('j08BcgoYhAQf.pdf', 'Accord1.pdf', '10', '2013-11-06 00:00:00', '2013-11-18 12:17:02', 'test.dam', 82),
('j9qjN6FpC5r9.pdf', 'Accord3.pdf', NULL, NULL, '2013-11-19 14:51:07', 'test.dam', 82),
('jsuHcbxcZWGE.pdf', 'Accord2.pdf', '10', '2013-11-05 00:00:00', '2013-11-19 10:20:11', 'test.dam', 82),
('jz3onZKkfRbb.pdf', 'Anatomie du cauchemar.pdf', '10', '2013-05-15 00:00:00', '2013-11-15 19:03:56', 'test.dam', 82),
('kKn0wf7HoOUY.pdf', '10 jours, 10 heures, 10 minutes.pdf', '10', '2013-11-06 00:00:00', '2013-11-18 12:25:40', 'test.dam', 82),
('m85kBXx7aD62.pdf', 'BoreHoleByJoeMellen.pdf', '10', '2013-05-15 00:00:00', '2013-11-15 19:03:56', 'test.dam', 82),
('njIHSRyo5QQx.pdf', 'Accord1.pdf', '10', '2013-11-04 00:00:00', '2013-11-18 10:33:26', 'test.dam', 82),
('p9IN2UDbpIH2.pdf', 'Accord2.pdf', '10', '2013-11-06 00:00:00', '2013-11-18 10:33:26', 'test.dam', 82),
('Pd9kmudjsZbw.pdf', 'Anatomie du cauchemar.pdf', '10', '2013-11-11 00:00:00', '2013-11-15 20:26:20', 'test.dam', 82),
('pi6jlpOFHHaD.pdf', 'Time Sheet 2013_11_DBY.pdf', NULL, NULL, '2013-11-20 15:00:10', 'test.dam', 82),
('xn0ypjjI2zAb.pdf', 'Cult-final-with-cover-11a1.pdf', '10', '2013-05-15 00:00:00', '2013-11-15 19:03:57', 'test.dam', 82),
('xz0X5KGtaLrt.pdf', 'Scan.pdf', '10', '2013-05-15 00:00:00', '2013-11-15 19:03:59', 'test.dam', 82);

-- --------------------------------------------------------

--
-- Structure de la table `document_valeur_champ`
--

CREATE TABLE IF NOT EXISTS `document_valeur_champ` (
  `fk_document` varchar(100) NOT NULL,
  `fk_client` int(11) NOT NULL,
  `fk_valeur_champ` int(11) NOT NULL,
  `fk_champ` int(11) NOT NULL,
  `fk_monde` int(11) NOT NULL,
  PRIMARY KEY (`fk_document`,`fk_client`,`fk_valeur_champ`,`fk_champ`,`fk_monde`),
  KEY `fk_document_valeur_champ_valeur_champ1_idx` (`fk_valeur_champ`,`fk_champ`,`fk_monde`),
  KEY `fk_document_valeur_champ_document1_idx` (`fk_document`,`fk_client`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `document_valeur_champ`
--

INSERT INTO `document_valeur_champ` (`fk_document`, `fk_client`, `fk_valeur_champ`, `fk_champ`, `fk_monde`) VALUES
('AHSknB8cw6io.pdf', 82, 13, 5, 1),
('kKn0wf7HoOUY.pdf', 82, 14, 5, 1),
('Pd9kmudjsZbw.pdf', 82, 15, 5, 1),
('6pzeOKJOeTJf.pdf', 82, 16, 5, 1),
('BzF9arS6ldM8.pdf', 82, 16, 5, 1),
('cGmiAe9abrdW.pdf', 82, 16, 5, 1),
('F2TQ5YsHdtif.pdf', 82, 17, 5, 1),
('IjlBB7rMTY3Z.pdf', 82, 17, 5, 1),
('jz3onZKkfRbb.pdf', 82, 17, 5, 1),
('m85kBXx7aD62.pdf', 82, 17, 5, 1),
('0qJJRuzlIqgD.pdf', 82, 18, 5, 1),
('hbmPiUMaml4o.pdf', 82, 18, 5, 1),
('hGSazQ9tLhXO.pdf', 82, 18, 5, 1),
('HSSckcfMlnXN.pdf', 82, 18, 5, 1),
('xn0ypjjI2zAb.pdf', 82, 21, 7, 2),
('xz0X5KGtaLrt.pdf', 82, 21, 7, 2),
('DL5EZGhsF0u5.pdf', 82, 27, 5, 1),
('jsuHcbxcZWGE.pdf', 82, 27, 5, 1),
('fG767tTA9MUr.pdf', 82, 40, 5, 1),
('njIHSRyo5QQx.pdf', 82, 40, 5, 1),
('p9IN2UDbpIH2.pdf', 82, 40, 5, 1),
('F2TQ5YsHdtif.pdf', 82, 45, 6, 1),
('m85kBXx7aD62.pdf', 82, 45, 6, 1),
('BzF9arS6ldM8.pdf', 82, 51, 6, 1),
('cGmiAe9abrdW.pdf', 82, 51, 6, 1),
('hbmPiUMaml4o.pdf', 82, 52, 6, 1),
('hGSazQ9tLhXO.pdf', 82, 52, 6, 1),
('h7G5hpXgQq8j.pdf', 82, 53, 5, 1),
('I3f4FSmUK7kz.pdf', 82, 53, 5, 1),
('j08BcgoYhAQf.pdf', 82, 53, 5, 1),
('h7G5hpXgQq8j.pdf', 82, 54, 6, 1),
('I3f4FSmUK7kz.pdf', 82, 54, 6, 1),
('j08BcgoYhAQf.pdf', 82, 54, 6, 1);

-- --------------------------------------------------------

--
-- Structure de la table `monde`
--

CREATE TABLE IF NOT EXISTS `monde` (
  `pk_monde` int(11) NOT NULL AUTO_INCREMENT,
  `label_monde` varchar(45) DEFAULT NULL,
  `niveau_monde` int(11) DEFAULT NULL,
  `fk_client` int(11) NOT NULL,
  PRIMARY KEY (`pk_monde`,`fk_client`),
  KEY `fk_monde_client` (`fk_client`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `monde`
--

INSERT INTO `monde` (`pk_monde`, `label_monde`, `niveau_monde`, `fk_client`) VALUES
(1, 'Operativo', 10, 82),
(2, 'Provedores', 20, 82);

-- --------------------------------------------------------

--
-- Structure de la table `type_doc`
--

CREATE TABLE IF NOT EXISTS `type_doc` (
  `pk_type_doc` int(11) NOT NULL AUTO_INCREMENT,
  `label_type_doc` varchar(100) NOT NULL,
  `detail_type_doc` tinyint(1) NOT NULL,
  `niveau_type_doc` int(11) DEFAULT NULL,
  `fk_categorie_doc` int(11) NOT NULL,
  `fk_champ` int(11) NOT NULL,
  `fk_monde` int(11) NOT NULL,
  `fk_client` int(11) NOT NULL,
  PRIMARY KEY (`pk_type_doc`,`fk_categorie_doc`,`fk_champ`,`fk_monde`,`fk_client`),
  KEY `fk_type_doc_categorie_doc1_idx` (`fk_categorie_doc`,`fk_champ`,`fk_monde`,`fk_client`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=36 ;

--
-- Contenu de la table `type_doc`
--

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

-- --------------------------------------------------------

--
-- Structure de la table `type_doc_document`
--

CREATE TABLE IF NOT EXISTS `type_doc_document` (
  `fk_type_doc` int(11) NOT NULL,
  `fk_categorie_doc` int(11) NOT NULL,
  `fk_champ` int(11) NOT NULL,
  `fk_monde` int(11) NOT NULL,
  `fk_client` int(11) NOT NULL,
  `fk_document` varchar(100) NOT NULL,
  `detail_type_doc` varchar(45) NOT NULL,
  `revision_type_doc` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`fk_client`,`fk_monde`,`fk_champ`,`fk_categorie_doc`,`fk_type_doc`,`detail_type_doc`,`revision_type_doc`,`fk_document`),
  KEY `REVISION` (`revision_type_doc`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `type_doc_document`
--

INSERT INTO `type_doc_document` (`fk_type_doc`, `fk_categorie_doc`, `fk_champ`, `fk_monde`, `fk_client`, `fk_document`, `detail_type_doc`, `revision_type_doc`) VALUES
(23, 0, 5, 1, 82, '6pzeOKJOeTJf.pdf', '', 1),
(23, 0, 5, 1, 82, 'AHSknB8cw6io.pdf', '', 1),
(23, 0, 5, 1, 82, 'HSSckcfMlnXN.pdf', '', 1),
(23, 0, 5, 1, 82, 'IjlBB7rMTY3Z.pdf', '', 1),
(23, 0, 5, 1, 82, 'kKn0wf7HoOUY.pdf', '', 1),
(23, 0, 5, 1, 82, 'njIHSRyo5QQx.pdf', '', 1),
(23, 0, 5, 1, 82, 'Pd9kmudjsZbw.pdf', '', 1),
(24, 0, 5, 1, 82, 'DL5EZGhsF0u5.pdf', 'de test', 1),
(25, 0, 6, 1, 82, 'BzF9arS6ldM8.pdf', '', 1),
(25, 0, 6, 1, 82, 'j08BcgoYhAQf.pdf', '', 1),
(26, 6, 6, 1, 82, 'hGSazQ9tLhXO.pdf', '', 1),
(27, 6, 6, 1, 82, 'cGmiAe9abrdW.pdf', '', 1),
(27, 6, 6, 1, 82, 'h7G5hpXgQq8j.pdf', '', 1),
(29, 7, 6, 1, 82, 'hbmPiUMaml4o.pdf', '', 1),
(30, 7, 6, 1, 82, 'I3f4FSmUK7kz.pdf', '', 1),
(31, 7, 6, 1, 82, 'F2TQ5YsHdtif.pdf', 'de almacen', 1),
(34, 0, 7, 2, 82, 'xn0ypjjI2zAb.pdf', '', 1),
(35, 9, 7, 2, 82, 'xz0X5KGtaLrt.pdf', 'de surveillance', 1),
(23, 0, 5, 1, 82, '0qJJRuzlIqgD.pdf', '', 2),
(23, 0, 5, 1, 82, 'jz3onZKkfRbb.pdf', '', 2),
(23, 0, 5, 1, 82, 'p9IN2UDbpIH2.pdf', '', 2),
(24, 0, 5, 1, 82, 'jsuHcbxcZWGE.pdf', 'de test', 2),
(31, 7, 6, 1, 82, 'm85kBXx7aD62.pdf', 'de almacen', 2),
(23, 0, 5, 1, 82, 'fG767tTA9MUr.pdf', '', 3);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `login_user` varchar(32) NOT NULL,
  `mdp_user` varchar(88) NOT NULL,
  `mail_user` varchar(50) NOT NULL,
  `niveau_user` int(11) NOT NULL,
  `clef_user` varchar(512) NOT NULL,
  `fk_client` int(11) NOT NULL,
  PRIMARY KEY (`login_user`,`fk_client`),
  KEY `fk_user_client1` (`fk_client`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`login_user`, `mdp_user`, `mail_user`, `niveau_user`, `clef_user`, `fk_client`) VALUES
('LeSuperAdminEstUnBatard', '9eac9bcd3f660d49b7c96ff8583e4b218bc70008', 'dam.buty@gmail.com', 999, '', 0),
('test.dam', 'ac86ff68126d5b03c41fd1b816273bb3d06f16340ef27e7e617c83e3c419254f', 'dam.buty@gmail.com', 30, 'tQY3Q/7PVUWoZhsM4wc37WcbAznnXDK+rSo1xMrXIHInQv593uBLunQRE2WPL1GiQCc8m6SaXp6TLtB89XpNFQ==', 82);

-- --------------------------------------------------------

--
-- Structure de la table `user_valeur_champ`
--

CREATE TABLE IF NOT EXISTS `user_valeur_champ` (
  `fk_user` varchar(32) NOT NULL,
  `fk_client` int(11) NOT NULL,
  `fk_valeur_champ` int(11) NOT NULL,
  `fk_champ` int(11) NOT NULL,
  `fk_monde` int(11) NOT NULL,
  PRIMARY KEY (`fk_user`,`fk_client`,`fk_valeur_champ`,`fk_champ`,`fk_monde`),
  KEY `fk_user_valeur_champ_valeur_champ1_idx` (`fk_valeur_champ`,`fk_champ`,`fk_monde`),
  KEY `fk_user_valeur_champ_user1_idx` (`fk_user`,`fk_client`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `valeur_champ`
--

CREATE TABLE IF NOT EXISTS `valeur_champ` (
  `pk_valeur_champ` int(11) NOT NULL AUTO_INCREMENT,
  `label_valeur_champ` varchar(45) DEFAULT NULL,
  `fk_champ` int(11) NOT NULL,
  `fk_monde` int(11) NOT NULL,
  `fk_client` int(11) NOT NULL,
  `fk_parent` int(11) NOT NULL,
  PRIMARY KEY (`pk_valeur_champ`,`fk_champ`,`fk_monde`,`fk_client`,`fk_parent`),
  KEY `fk_valeur_champ_champ1_idx` (`fk_champ`,`fk_monde`,`fk_client`),
  KEY `fk_valeur_champ_valeur_champ1_idx` (`fk_parent`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=55 ;

--
-- Contenu de la table `valeur_champ`
--

INSERT INTO `valeur_champ` (`pk_valeur_champ`, `label_valeur_champ`, `fk_champ`, `fk_monde`, `fk_client`, `fk_parent`) VALUES
(13, 'Apple', 5, 1, 82, 0),
(14, 'Google', 5, 1, 82, 0),
(15, 'Samsung', 5, 1, 82, 0),
(16, 'Fender', 5, 1, 82, 0),
(17, 'Marshall', 5, 1, 82, 0),
(18, 'ElectroHarmonix', 5, 1, 82, 0),
(19, 'FBI', 7, 2, 82, 0),
(20, 'NSA', 7, 2, 82, 0),
(21, 'KGB', 7, 2, 82, 0),
(22, 'CIA', 7, 2, 82, 0),
(23, 'Playschool', 7, 2, 82, 0),
(24, 'TESTAPPLE', 6, 1, 82, 13),
(25, 'TESTGOOG', 6, 1, 82, 14),
(27, 'Facebook', 5, 1, 82, 0),
(28, 'Orange', 5, 1, 82, 0),
(29, 'Yamaha', 5, 1, 82, 0),
(30, 'TESTYAM', 6, 1, 82, 29),
(32, 'Twitter', 5, 1, 82, 0),
(33, 'TESTTWIT', 6, 1, 82, 32),
(34, 'Zendesk', 5, 1, 82, 0),
(35, 'AG0120012', 6, 1, 82, 34),
(36, 'AG022014', 6, 1, 82, 34),
(37, 'MailChimp', 5, 1, 82, 0),
(38, 'NEWSLETTER', 6, 1, 82, 37),
(39, 'TESTGOOG2', 6, 1, 82, 14),
(40, 'Takeda', 5, 1, 82, 0),
(41, 'V12423113', 6, 1, 82, 40),
(42, 'V324213', 6, 1, 82, 40),
(43, 'MK-ULTRA', 7, 2, 82, 0),
(44, 'Stratocaster', 6, 1, 82, 16),
(45, 'WALL', 6, 1, 82, 17),
(46, 'Big Muff', 6, 1, 82, 18),
(47, 'Telecaster', 6, 1, 82, 16),
(48, 'Rich Hazarai', 6, 1, 82, 18),
(49, 'Tiny Terror', 6, 1, 82, 28),
(50, 'iPhone 18', 6, 1, 82, 13),
(51, 'Turbocaster', 6, 1, 82, 16),
(52, 'Mega Hazarai', 6, 1, 82, 18),
(53, 'Correo Solucion', 5, 1, 82, 0),
(54, 'TEST OPERACION', 6, 1, 82, 53);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
