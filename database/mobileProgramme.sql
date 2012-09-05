CREATE TABLE `tblAct` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` text,
  `image` varchar(100) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `page` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `tblActStage` (
  `day` int(11) NOT NULL DEFAULT '1',
  `stageID` int(11) unsigned NOT NULL,
  `actID` int(11) NOT NULL DEFAULT '0',
  `time` time DEFAULT NULL,
  `duration` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `tblEvent` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `eventDate` date DEFAULT NULL,
  `days` int(11) DEFAULT NULL,
  `venue` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `tblStage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `displayOrder` int(11) NOT NULL,
  `publishTimes` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `tblVersion` (
  `appVersion` int(11) unsigned NOT NULL,
  `dbVersion` int(11) NOT NULL,
  PRIMARY KEY (`appVersion`),
  UNIQUE KEY `dbVersion` (`dbVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
