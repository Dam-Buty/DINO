-- phpMyAdmin SQL Dump
-- version 4.0.7
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Lun 14 Octobre 2013 à 19:58
-- Version du serveur: 5.5.32-0ubuntu0.13.04.1
-- Version de PHP: 5.4.9-4ubuntu2.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `csstorage2`
--
CREATE DATABASE IF NOT EXISTS `csstorage2` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `csstorage2`;

DELIMITER $$
--
-- Procédures
--
DROP PROCEDURE IF EXISTS `proc_douanes`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_douanes`(IN `leClient` INT)
    READS SQL DATA
SELECT 
(       SELECT COUNT( * ) 
        FROM  `client_douane` AS `cd` 
        WHERE  `client` = `leClient`
        AND  `douane`.`code_douane` =  `cd`.`douane`
) AS `detail`,  
`code_douane` AS `id`,  `nom_douane` AS `label`
FROM  `douane` AS `douane` 
ORDER BY `detail` DESC, `nom_douane`$$

DROP PROCEDURE IF EXISTS `proc_test`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_test`(IN `leClient` INT)
    NO SQL
SELECT * FROM `douane`$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `categorie_doc`
--

DROP TABLE IF EXISTS `categorie_doc`;
CREATE TABLE IF NOT EXISTS `categorie_doc` (
  `pk_categorie_doc` int(11) NOT NULL AUTO_INCREMENT,
  `label_categorie_doc` varchar(50) NOT NULL,
  PRIMARY KEY (`pk_categorie_doc`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `categorie_doc`
--

INSERT INTO `categorie_doc` (`pk_categorie_doc`, `label_categorie_doc`) VALUES
(1, 'Contabilidad'),
(2, 'Historico'),
(3, 'Operativo'),
(4, 'Otros');

-- --------------------------------------------------------

--
-- Structure de la table `champ`
--

DROP TABLE IF EXISTS `champ`;
CREATE TABLE IF NOT EXISTS `champ` (
  `pk_champ` int(11) NOT NULL AUTO_INCREMENT,
  `label_champ` varchar(100) NOT NULL,
  `pluriel_champ` varchar(50) NOT NULL,
  `source_champ` varchar(30) NOT NULL,
  `fk_profil` int(11) NOT NULL,
  PRIMARY KEY (`pk_champ`,`fk_profil`),
  KEY `fk_champ_profil1` (`fk_profil`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `champ`
--

INSERT INTO `champ` (`pk_champ`, `label_champ`, `pluriel_champ`, `source_champ`, `fk_profil`) VALUES
(3, 'Aduana', 'Aduanas', 'proc_douanes', 1),
(4, 'test', 'tests', 'proc_test', 1);

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

DROP TABLE IF EXISTS `client`;
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
  `fk_profil` int(11) NOT NULL,
  `bucket_client` int(11) NOT NULL,
  `call_me_maybe` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pk_client`),
  KEY `fk_client_profil1` (`fk_profil`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=82 ;

--
-- Contenu de la table `client`
--

INSERT INTO `client` (`pk_client`, `entreprise_client`, `mail_client`, `nom_contact_client`, `poste_contact_client`, `phone_contact_client`, `ext_contact_client`, `nb_emp_client`, `nb_op_client`, `nb_douanes_client`, `credit_client`, `statut_client`, `fk_profil`, `bucket_client`, `call_me_maybe`) VALUES
(81, 'Correo Solucion', 'dam.buty@gmail.com', '', '', '', '', 0, 0, 0, '10000', 0, 1, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `client_douane`
--

DROP TABLE IF EXISTS `client_douane`;
CREATE TABLE IF NOT EXISTS `client_douane` (
  `client` int(11) NOT NULL,
  `douane` int(11) NOT NULL,
  PRIMARY KEY (`client`,`douane`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `client_douane`
--

INSERT INTO `client_douane` (`client`, `douane`) VALUES
(66, 1),
(66, 11),
(66, 20),
(66, 23);

-- --------------------------------------------------------

--
-- Structure de la table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
CREATE TABLE IF NOT EXISTS `coupon` (
  `coupon` varchar(20) NOT NULL,
  `credits` int(11) NOT NULL,
  PRIMARY KEY (`coupon`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `document`
--

DROP TABLE IF EXISTS `document`;
CREATE TABLE IF NOT EXISTS `document` (
  `pk_document` int(11) NOT NULL,
  `type_document` int(11) NOT NULL,
  `detail_type_document` varchar(30) NOT NULL,
  `filename_document` varchar(100) NOT NULL,
  `fk_operation` varchar(20) NOT NULL,
  `fk_client` int(11) NOT NULL,
  `nom_temp_document` varchar(100) NOT NULL,
  PRIMARY KEY (`pk_document`,`type_document`,`fk_operation`,`fk_client`,`nom_temp_document`),
  KEY `fk_document_type_doc1` (`type_document`),
  KEY `fk_document_operation1` (`fk_operation`),
  KEY `fk_document_client1` (`fk_client`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `document`
--

INSERT INTO `document` (`pk_document`, `type_document`, `detail_type_document`, `filename_document`, `fk_operation`, `fk_client`, `nom_temp_document`) VALUES
(0, 0, '', 'FeuFin.pdf', '', 81, 'OS73ndkKaTCm.pdf');

-- --------------------------------------------------------

--
-- Structure de la table `douane`
--

DROP TABLE IF EXISTS `douane`;
CREATE TABLE IF NOT EXISTS `douane` (
  `code_douane` int(11) NOT NULL,
  `nom_douane` varchar(45) NOT NULL,
  PRIMARY KEY (`code_douane`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `douane`
--

INSERT INTO `douane` (`code_douane`, `nom_douane`) VALUES
(1, 'ACAPULCO'),
(2, 'AGUA PRIETA'),
(5, 'SUBTENIENTE LOPEZ'),
(6, 'CIUDAD DEL CARMEN'),
(7, 'CIUDAD JUAREZ'),
(8, 'COATZACOALCOS'),
(11, 'ENSENADA'),
(12, 'GUAYMAS'),
(14, 'LA PAZ'),
(16, 'MANZANILLO'),
(17, 'MATAMOROS'),
(18, 'MAZATLAN'),
(19, 'MEXICALI'),
(20, 'MEXICO'),
(22, 'NACO'),
(23, 'NOGALES'),
(24, 'NUEVO LAREDO'),
(25, 'OJINAGA'),
(26, 'PUERTO PALOMAS'),
(27, 'PIEDRAS NEGRAS'),
(28, 'PROGRESO'),
(30, 'CIUDAD REYNOSA'),
(31, 'SALINA CRUZ'),
(33, 'SAN LUIS RIO COLORADO'),
(34, 'CIUDAD MIGUEL ALEMAN'),
(37, 'CIUDAD HIDALGO'),
(38, 'TAMPICO'),
(39, 'TECATE'),
(40, 'TIJUANA'),
(42, 'TUXPAN'),
(43, 'VERACRUZ'),
(44, 'CIUDAD ACUNA'),
(46, 'TORREON'),
(47, 'MEXICO AEROPUERTO'),
(48, 'GUADALAJARA'),
(50, 'SONOYTA'),
(51, 'LAZARO CARDENAS'),
(52, 'MONTERREY'),
(53, 'CANCUN'),
(64, 'QUERETARO'),
(65, 'TOLUCA'),
(67, 'CHIHUAHUA'),
(73, 'AGUASCALIENTES'),
(75, 'PUEBLA'),
(80, 'COLOMBIA'),
(81, 'ALTAMIRA'),
(82, 'CIUDAD CAMARGO'),
(83, 'DOS BOCAS'),
(84, 'GUANAJUATO');

-- --------------------------------------------------------

--
-- Structure de la table `interlocuteur`
--

DROP TABLE IF EXISTS `interlocuteur`;
CREATE TABLE IF NOT EXISTS `interlocuteur` (
  `pk_interlocuteur` int(11) NOT NULL AUTO_INCREMENT,
  `num_interlocuteur` int(11) NOT NULL,
  `nom_interlocuteur` varchar(50) NOT NULL,
  `mail_interlocuteur` varchar(100) NOT NULL,
  `fk_client` int(11) NOT NULL,
  PRIMARY KEY (`pk_interlocuteur`),
  KEY `fk_interlocuteur_client1` (`fk_client`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=83 ;

--
-- Contenu de la table `interlocuteur`
--

INSERT INTO `interlocuteur` (`pk_interlocuteur`, `num_interlocuteur`, `nom_interlocuteur`, `mail_interlocuteur`, `fk_client`) VALUES
(81, 0, 'Cliente test', '', 66),
(82, 1, 'Apple Inc.', '', 66);

-- --------------------------------------------------------

--
-- Structure de la table `operation`
--

DROP TABLE IF EXISTS `operation`;
CREATE TABLE IF NOT EXISTS `operation` (
  `pk_operation` varchar(20) NOT NULL,
  `date_operation` date NOT NULL,
  `fk_client` int(11) NOT NULL,
  `fk_interlocuteur` int(11) NOT NULL,
  PRIMARY KEY (`pk_operation`,`fk_client`,`fk_interlocuteur`),
  KEY `fk_operation_client1` (`fk_client`),
  KEY `fk_operation_interlocuteur1` (`fk_interlocuteur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `operation_champ`
--

DROP TABLE IF EXISTS `operation_champ`;
CREATE TABLE IF NOT EXISTS `operation_champ` (
  `fk_operation` int(11) NOT NULL,
  `fk_champ` int(11) NOT NULL,
  `valeur` int(11) NOT NULL,
  PRIMARY KEY (`fk_operation`,`fk_champ`),
  KEY `fk_operation_champ_operation1` (`fk_operation`),
  KEY `fk_operation_champ_champ1` (`fk_champ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `partage_categorie_doc`
--

DROP TABLE IF EXISTS `partage_categorie_doc`;
CREATE TABLE IF NOT EXISTS `partage_categorie_doc` (
  `fk_client` int(11) NOT NULL,
  `fk_categorie_doc` int(11) NOT NULL,
  PRIMARY KEY (`fk_client`,`fk_categorie_doc`),
  KEY `fk_client_type_doc_client1` (`fk_client`),
  KEY `fk_partage_categorie_doc_categorie_doc1` (`fk_categorie_doc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `partage_type_doc`
--

DROP TABLE IF EXISTS `partage_type_doc`;
CREATE TABLE IF NOT EXISTS `partage_type_doc` (
  `fk_client` int(11) NOT NULL,
  `fk_type_doc` int(11) NOT NULL,
  PRIMARY KEY (`fk_client`,`fk_type_doc`),
  KEY `fk_client_type_doc_client1` (`fk_client`),
  KEY `fk_client_type_doc_type_doc1` (`fk_type_doc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `profil`
--

DROP TABLE IF EXISTS `profil`;
CREATE TABLE IF NOT EXISTS `profil` (
  `pk_profil` int(11) NOT NULL AUTO_INCREMENT,
  `nom_profil` varchar(20) NOT NULL,
  PRIMARY KEY (`pk_profil`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `profil`
--

INSERT INTO `profil` (`pk_profil`, `nom_profil`) VALUES
(1, 'Agencias Aduanales');

-- --------------------------------------------------------

--
-- Structure de la table `type_doc`
--

DROP TABLE IF EXISTS `type_doc`;
CREATE TABLE IF NOT EXISTS `type_doc` (
  `pk_type_doc` int(11) NOT NULL AUTO_INCREMENT,
  `label_type_doc` varchar(100) NOT NULL,
  `detail_type_doc` tinyint(1) NOT NULL,
  `fk_categorie_doc` int(11) NOT NULL,
  `fk_profil` int(11) NOT NULL,
  PRIMARY KEY (`pk_type_doc`),
  KEY `fk_type_doc_profil1` (`fk_profil`),
  KEY `fk_type_doc_categorie_doc1` (`fk_categorie_doc`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=23 ;

--
-- Contenu de la table `type_doc`
--

INSERT INTO `type_doc` (`pk_type_doc`, `label_type_doc`, `detail_type_doc`, `fk_categorie_doc`, `fk_profil`) VALUES
(12, 'Cuenta de gastos', 0, 1, 1),
(13, 'Factura', 1, 1, 1),
(14, 'Comunicación cliente', 0, 2, 1),
(15, 'Cotización', 0, 2, 1),
(16, 'Pedimiento', 0, 3, 1),
(17, 'Certificado de origen', 0, 3, 1),
(18, 'Conocimiento de embarque', 0, 3, 1),
(19, 'B/L', 0, 3, 1),
(20, 'COVE', 0, 3, 1),
(21, 'Fotografías', 1, 4, 1),
(22, 'Otro', 1, 4, 1);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `login_user` varchar(32) NOT NULL,
  `mdp_user` varchar(88) NOT NULL,
  `mail_user` varchar(50) NOT NULL,
  `niveau_user` int(11) NOT NULL,
  `fk_client` int(11) NOT NULL,
  `fk_interlocuteur` int(11) NOT NULL,
  `clef_user` varchar(512) NOT NULL,
  PRIMARY KEY (`login_user`),
  KEY `fk_user_interlocuteur1` (`fk_interlocuteur`),
  KEY `fk_user_client1` (`fk_client`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`login_user`, `mdp_user`, `mail_user`, `niveau_user`, `fk_client`, `fk_interlocuteur`, `clef_user`) VALUES
('LeSuperAdminEstUnBatard', '9eac9bcd3f660d49b7c96ff8583e4b218bc70008', 'dam.buty@gmail.com', 999, 0, 0, ''),
('bretelle', 'Ôº²nKE qÔwvù]Pz$Äª@•Æålö)12Ú', 'dam.buty@gmail.com', 30, 81, 0, 'YPZpMFK1kaAm3c2VDE5RTKOQe1yANmZX+jJ7+U6OmDAlUJ/IDzRrwhZhE5hDvIRCsd5/F7ZMHuR2yDMYd2LX4g==');

-- --------------------------------------------------------

--
-- Structure de la table `user_champ`
--

DROP TABLE IF EXISTS `user_champ`;
CREATE TABLE IF NOT EXISTS `user_champ` (
  `login_user` varchar(32) NOT NULL,
  `fk_champ` int(11) NOT NULL,
  `fk_profil` int(11) NOT NULL,
  `valeur_champ` int(11) DEFAULT NULL,
  PRIMARY KEY (`login_user`,`fk_champ`,`fk_profil`),
  KEY `fk_user_has_champ_champ1` (`fk_champ`,`fk_profil`),
  KEY `fk_user_has_champ_user` (`login_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `user_champ`
--

INSERT INTO `user_champ` (`login_user`, `fk_champ`, `fk_profil`, `valeur_champ`) VALUES
('georges.mega', 3, 1, 23),
('georges.mega', 4, 1, 54);

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `champ`
--
ALTER TABLE `champ`
  ADD CONSTRAINT `fk_champ_profil1` FOREIGN KEY (`fk_profil`) REFERENCES `profil` (`pk_profil`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
