-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: alaska-cafe
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bill`
--

DROP TABLE IF EXISTS `bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(200) NOT NULL,
  `bill_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `total` int(11) NOT NULL,
  `product_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`product_details`)),
  `created_by` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill`
--

LOCK TABLES `bill` WRITE;
/*!40000 ALTER TABLE `bill` DISABLE KEYS */;
INSERT INTO `bill` VALUES (22,'d6dc5990-6449-11ef-af8c-29c6fde417f3','Jasmine','jasmine@gmail.com','088393293028','Card',15000,'[{\"id\": 1, \"name\": \"Black Coffee\", \"price\": 99, \"total\": 99, \"category\": \"Coffee\", \"quantity\": \"1\"}]','jasmine@gmail.com'),(23,'039e1ac0-644c-11ef-be93-e997c54aabd4','Jasmine','jasmine@gmail.com','088393293028','Card',15000,'[{\"id\": 1, \"name\": \"Black Coffee\", \"price\": 99, \"total\": 99, \"category\": \"Coffee\", \"quantity\": \"1\"}]','admin@gmail.com'),(24,'98065e80-6509-11ef-8be9-79c776cb7e97','Haikal Putra','mulyaputrahaikal8@gmail.com','0895348062299','Cash',12000,'[{\"id\":8,\"name\":\"Muffin\",\"category\":\"Cake\",\"quantity\":\"1\",\"price\":12000,\"total\":12000}]','admin@gmail.com'),(25,'d37b5100-6509-11ef-8be9-79c776cb7e97','Haikal Putra','mulyaputrahaikal8@gmail.com','0895348062299','Cash',45000,'[{\"id\":1,\"name\":\"Pepperoni Pizza\",\"category\":\"Pizza\",\"quantity\":\"1\",\"price\":45000,\"total\":45000}]','admin@gmail.com');
/*!40000 ALTER TABLE `bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Pizza'),(2,'Coffe'),(3,'Cake'),(4,'Pastry'),(5,'Juice');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Pepperoni Pizza',1,'Lorem ipsum dolor sit amet',45000,'true'),(2,'Espresso',2,'Lorem ipsum dolor sit amet',15000,'true'),(3,'Latte',2,'Lorem ipsum dolor sit amet',18000,'true'),(8,'Muffin',3,'Its a muffin',12000,'true');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contactNumber` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `status` varchar(20) NOT NULL,
  `role` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Admin','1231231231','admin@gmail.com','$2b$10$f6A8Jy7W2HPPCGAbRcFCAOH82bAOOP2V97PIZ2LHI0ulU0BZfOAGW','true','admin'),(2,'Haikal Putra','123321','haikal@gmail.com','$2y$10$e7XhmrPYdLKAGuMQ7rJBQuTMme0QWVosMddIwPaUHe8bnmFWl7UIW','true','user'),(3,'Si Putra','33333','mulyaputrahaikal8@gmail.com','$2b$10$TDA8Sje5Z1u.tYgQFosVxOqgUcfLLd3GULebKBPAiRJ1eNM6X5bWW','true','user'),(4,'Tes Email','312311231','alaska@mailinator.com','$2b$10$qToO0ljaZVoBLzHZN022busaalMKORSJm6sMcKgYj5UPRXqrcuULq','true','user'),(5,'Haikal Mulya Putra','083818372391','mulyaputrahaikal72@gmail.com','$2b$10$9MsKtvOJCAyk7Xx65lABQeMj.dPvJ13J5hs0kvaaEYv8NGuRg0ONS','false','user');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'alaska-cafe'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-30  8:46:45
