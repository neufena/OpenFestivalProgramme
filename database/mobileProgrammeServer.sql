# ************************************************************
# Sequel Pro SQL dump
# Version 3408
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: localhost (MySQL 5.5.15)
# Database: mobileFestivalProgramme
# Generation Time: 2012-10-22 19:04:19 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table tblAct
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tblAct`;

CREATE TABLE `tblAct` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` text,
  `image` varchar(100) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `page` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table tblActStage
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tblActStage`;

CREATE TABLE `tblActStage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `day` int(11) NOT NULL DEFAULT '1',
  `stageID` int(11) unsigned NOT NULL,
  `actID` int(11) NOT NULL DEFAULT '0',
  `time` time DEFAULT NULL,
  `duration` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table tblEvent
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tblEvent`;

CREATE TABLE `tblEvent` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `eventDate` date DEFAULT NULL,
  `days` int(11) DEFAULT NULL,
  `venue` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table tblStage
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tblStage`;

CREATE TABLE `tblStage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `displayOrder` int(11) NOT NULL,
  `publishTimes` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table tblVersion
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tblVersion`;

CREATE TABLE `tblVersion` (
  `appVersion` decimal(3,1) unsigned NOT NULL,
  `dbVersion` decimal(3,1) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
