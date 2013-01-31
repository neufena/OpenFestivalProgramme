-- phpMyAdmin SQL Dump
-- version 3.3.10.4
-- http://www.phpmyadmin.net
--
-- Host: mysql.minusmoney.co.uk
-- Generation Time: Oct 26, 2012 at 09:40 AM
-- Server version: 5.1.53
-- PHP Version: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mobilefestivalprogramme`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblAct`
--

CREATE TABLE IF NOT EXISTS `tblAct` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` text,
  `image` varchar(100) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `page` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

-- --------------------------------------------------------

--
-- Table structure for table `tblActStage`
--

CREATE TABLE IF NOT EXISTS `tblActStage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `day` int(11) NOT NULL DEFAULT '1',
  `stageID` int(11) unsigned NOT NULL,
  `actID` int(11) NOT NULL DEFAULT '0',
  `time` time DEFAULT NULL,
  `duration` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=23 ;

-- --------------------------------------------------------

--
-- Table structure for table `tblEvent`
--

CREATE TABLE IF NOT EXISTS `tblEvent` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `eventDate` date DEFAULT NULL,
  `days` int(11) DEFAULT NULL,
  `venue` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Table structure for table `tblStage`
--

CREATE TABLE IF NOT EXISTS `tblStage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `displayOrder` int(11) NOT NULL,
  `publishTimes` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

-- --------------------------------------------------------

--
-- Table structure for table `tblVersion`
--

CREATE TABLE IF NOT EXISTS `tblVersion` (
  `appVersion` decimal(3,1) unsigned NOT NULL,
  `dbVersion` decimal(3,1) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
