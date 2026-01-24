-- MariaDB dump 10.19-11.5.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: project_42
-- ------------------------------------------------------
-- Server version	11.5.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Fragen`
--

DROP TABLE IF EXISTS `Fragen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Fragen` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `FNUMBER` int(11) NOT NULL,
  `KATEGORIE` int(11) NOT NULL,
  `FRAGE` text DEFAULT NULL,
  `ANTWORT` text DEFAULT NULL,
  `FRAGE_TYP` enum('Text','Bild','Audio','Text + Bild','Text + Audio') NOT NULL,
  `MEDIA` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Kategorie` (`KATEGORIE`),
  KEY `FK_Medien` (`MEDIA`),
  CONSTRAINT `FK_Kategorie` FOREIGN KEY (`KATEGORIE`) REFERENCES `Kategorien` (`ID`),
  CONSTRAINT `FK_Medien` FOREIGN KEY (`MEDIA`) REFERENCES `Medien` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Fragen`
--

LOCK TABLES `Fragen` WRITE;
/*!40000 ALTER TABLE `Fragen` DISABLE KEYS */;
INSERT INTO `Fragen` VALUES
(1,1,1,'Top 10 - Suchbegriffe: Schlagzeilen',NULL,'Text',NULL),
(2,2,1,'Welche Disziplinen gehören zum modernen olypischen Zehnkampf?',NULL,'Text',NULL),
(3,3,1,'Welche 10 Sprachen sind die meist gesprochenen Sprachen der Welt?',NULL,'Text',NULL),
(4,4,1,'Welche Länder stellten 2018 den meisten Wein her?',NULL,'Text',NULL),
(5,5,1,'Welches sind die 10 schwersten, heute auf dem Land lebenden, Säugetiere?',NULL,'Text',NULL),
(6,1,2,'Welcher ist der zweithöchste Berg der Erde?','K2 -  Godwin-Austen / Chhogori | 8.611 m','Text',NULL),
(7,2,2,'Welches ist das dichtestbesiedelte Land der Erde?','Monaco / Bangladesh','Text',NULL),
(8,3,2,'Welches Land hat die meisten aktiven Vulkane?','Indonesien','Text',NULL),
(9,4,2,'Nenne drei Länder die mit \'J\' beginnen!','Jamaika, Japan, Jordanien, Jemen','Text',NULL),
(10,5,2,'Was versteht man unter dem Kessler Effekt?','Eine Kaskade and Kollisionen im Erdorbit.','Text',NULL),
(11,1,3,'Bis in die Unendlichkeit und noch viel weiter.','Buzz Lightyear','Text',NULL),
(12,2,3,'Wenn ich wählen muss zwischen einem Übel und einem kleineren, dann ziehe ich es vor, überhaupt nicht zu wählen.','Geralt von Riva','Text',NULL),
(13,3,3,'Wer entschlüsselte (maßgeblich) die Enigma?','Alan Turing','Text',NULL),
(14,4,3,'Wer hat die Häftlingsnummer \'24601\'?','Jean Valjean','Text + Audio',1),
(15,5,3,'Phantasie ist wichtiger als Wissen, denn Wissen ist begrenzt.','Albert Einstein','Text',NULL),
(16,1,4,'Welcher Song ist das?','Casper & Kraftklub - Ganz schön okay','Text + Audio',2),
(17,2,4,'Welches Geräusch ist das?','Kronkorken','Text + Audio',3),
(18,3,4,'Welches Geräusch ist das?','Computer-Tastatur','Text + Audio',4),
(19,4,4,'Welcher Song ist das?','Radiohead - Creep','Text + Audio',5),
(20,5,4,'Welcher Song ist das?','Soft Cell - Tainted Love','Text + Audio',6),
(21,1,5,NULL,NULL,'Bild',7),
(22,2,5,NULL,NULL,'Bild',8),
(23,3,5,NULL,NULL,'Bild',9),
(24,4,5,NULL,NULL,'Bild',10),
(25,5,5,NULL,NULL,'Bild',11);
/*!40000 ALTER TABLE `Fragen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Kategorien`
--

DROP TABLE IF EXISTS `Kategorien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Kategorien` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Kategorien`
--

LOCK TABLES `Kategorien` WRITE;
/*!40000 ALTER TABLE `Kategorien` DISABLE KEYS */;
INSERT INTO `Kategorien` VALUES
(1,'Br4nd'),
(2,'Blu3 Marble'),
(3,'W3r war\'s?'),
(4,'Hör m4l!'),
(5,'Wh4t do you meme?');
/*!40000 ALTER TABLE `Kategorien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Medien`
--

DROP TABLE IF EXISTS `Medien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Medien` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TYPE` enum('Bild','Audio') NOT NULL,
  `MEDIA` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Medien`
--

LOCK TABLES `Medien` WRITE;
/*!40000 ALTER TABLE `Medien` DISABLE KEYS */;
INSERT INTO `Medien` VALUES
(1,'Audio','./uploads/soundfiles/jvj.mp3'),
(2,'Audio','./uploads/soundfiles/ok.mp3'),
(3,'Audio','./uploads/soundfiles/kk.mp3'),
(4,'Audio','./uploads/soundfiles/tasten.mp3'),
(5,'Audio','./uploads/soundfiles/creep.mp3'),
(6,'Audio','./uploads/soundfiles/ttl.mp3'),
(7,'Bild','./uploads/qimg/wdym.jpg'),
(8,'Bild','./uploads/qimg/wdym8.jpg'),
(9,'Bild','./uploads/qimg/wdym11.jpg'),
(10,'Bild','./uploads/qimg/wdym12.png'),
(11,'Bild','./uploads/qimg/wdym14.jpg');
/*!40000 ALTER TABLE `Medien` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-09-27 21:59:45
