/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 5.7.20-log : Database - db_student
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_student` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `db_student`;

/*Table structure for table `t_class` */

DROP TABLE IF EXISTS `t_class`;

CREATE TABLE `t_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classNum` int(11) DEFAULT NULL,
  `className` varchar(5) DEFAULT NULL,
  `gradeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gradeId` (`gradeId`),
  CONSTRAINT `t_class_ibfk_1` FOREIGN KEY (`gradeId`) REFERENCES `t_grade` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `t_class` */

insert  into `t_class`(`id`,`classNum`,`className`,`gradeId`) values (1,1,'一班',1),(2,2,'二班',1),(3,1,'一班',2),(4,2,'二班',2),(5,1,'一班',3),(6,1,'一班',4),(7,2,'二班',5),(8,3,'三班',5),(9,1,'一班',6),(10,2,'二班',6),(11,1,'一班',5);

/*Table structure for table `t_code` */

DROP TABLE IF EXISTS `t_code`;

CREATE TABLE `t_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

/*Data for the table `t_code` */

insert  into `t_code`(`id`,`code`,`state`,`time`,`email`) values (1,NULL,NULL,1517293843,NULL),(2,NULL,NULL,NULL,NULL),(3,'955234',3,1517294964,'453430651@qq.com'),(4,'688193',3,1517295154,'453430651@qq.com'),(5,'588278',2,1517295189,'453430651@qq.com'),(6,'989018',2,1517295953,'453430651@qq.com'),(7,'925757',2,1517296408,'453430651@qq.com'),(8,'946430',2,1517296617,'453430651@qq.com'),(9,'154030',2,1517296785,'453430651@qq.com'),(10,'935022',2,1517299931,'453430651@qq.com'),(11,'313872',2,1517300093,'453430651@qq.com'),(12,'953269',2,1517300235,'453430651@qq.com'),(13,'496691',2,1517477380,'453430651@qq.com'),(14,'232717',2,1517536534,'453430651@qq.com'),(15,'290625',2,1517544125,'453430651@qq.com'),(16,'672663',2,1517566994,'453430651@qq.com'),(17,'646504',2,1517567080,'453430651@qq.com'),(18,'850907',2,1517567286,'453430651@qq.com'),(19,'696961',2,1517567455,'453430651@qq.com'),(20,'818929',2,1517797161,'453430651@qq.com'),(21,'584958',2,1517797546,'453430651@qq.com'),(22,'595203',2,1517797697,'453430651@qq.com'),(23,'114387',2,1517797872,'453430651@qq.com'),(24,'399566',2,1517797995,'453430651@qq.com'),(25,'840541',2,1517798112,'453430651@qq.com'),(26,'666081',2,1517798145,'453430651@qq.com'),(27,'358086',2,1517798212,'453430651@qq.com'),(28,'148898',2,1517798260,'453430651@qq.com'),(29,'955741',2,1517798288,'453430651@qq.com'),(30,'154310',2,1517799676,'453430651@qq.com'),(31,'047528',2,1517799955,'453430651@qq.com');

/*Table structure for table `t_grade` */

DROP TABLE IF EXISTS `t_grade`;

CREATE TABLE `t_grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade` int(11) DEFAULT NULL,
  `gradeName` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `t_grade` */

insert  into `t_grade`(`id`,`grade`,`gradeName`) values (1,1,'一年级'),(2,2,'二年级'),(3,3,'三年级'),(4,4,'四年级'),(5,5,'五年级'),(6,6,'六年级');

/*Table structure for table `t_student` */

DROP TABLE IF EXISTS `t_student`;

CREATE TABLE `t_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) DEFAULT NULL,
  `studentNumber` int(11) DEFAULT NULL,
  `sex` int(11) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL,
  `gradeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classId` (`classId`),
  KEY `gradeId` (`gradeId`),
  CONSTRAINT `t_student_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `t_class` (`id`),
  CONSTRAINT `t_student_ibfk_2` FOREIGN KEY (`gradeId`) REFERENCES `t_grade` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;

/*Data for the table `t_student` */

insert  into `t_student`(`id`,`name`,`studentNumber`,`sex`,`classId`,`gradeId`) values (34,'张三1',1001,1,1,1),(35,'张三2',1002,1,2,1),(37,'展示4',1004,1,4,2),(38,'展示5',1005,1,5,3),(40,'DISW',1010,1,1,1),(41,'SQEI',1011,2,1,1),(42,'DQID',1012,1,11,5),(43,'CXSQ',1022,1,7,5),(44,'学校咋',1025,1,8,5),(45,'阿斯蒂芬',1026,2,9,6),(46,'2恩啊',1027,1,10,6),(47,'从vx',1028,1,6,4),(48,'asdf',1036,1,3,2),(49,'DSAD',1040,1,2,1),(50,'DADSF',1041,1,9,6),(51,'SDFAZ',1042,1,9,6),(52,'XCVG',1043,1,9,6),(53,'xcvx',1047,1,9,6),(54,'dfgh',1044,1,10,6);

/*Table structure for table `t_user` */

DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `authorization` int(11) DEFAULT NULL,
  `userState` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `t_user` */

insert  into `t_user`(`id`,`username`,`password`,`email`,`authorization`,`userState`) values (1,'bbb','c8641536d727ecdf37aa3d832dd57079','453430651@qq.com',15,1),(2,'acvsd','98b2f0c6735670139dc1f7bd7fe9286c','453430651@qq.com',5,1),(3,'wanghao','98b2f0c6735670139dc1f7bd7fe9286c','453430651@qq.com',5,1),(4,'aaaaaa','98b2f0c6735670139dc1f7bd7fe9286c','453430651@qq.com',5,2);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
