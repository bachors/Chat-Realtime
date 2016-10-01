-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 01, 2016 at 12:30 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat_realtime`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(20) NOT NULL,
  `name` text NOT NULL,
  `ke` text NOT NULL,
  `avatar` varchar(500) NOT NULL,
  `message` text NOT NULL,
  `tipe` varchar(200) NOT NULL,
  `date` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `ke`, `avatar`, `message`, `tipe`, `date`) VALUES
(1, 'bachors', 'public', 'http://3.bp.blogspot.com/-c8O1QI1Ty24/UikpRn-WYLI/AAAAAAAAJ0Y/hCd3SVMejGQ/s1600/1cc767a412f68bc6ff6f26b526c4ecfd.jpeg', 'Aplikasi ini akan selalu bersetatus (BETA).', 'rooms', '2016-10-01 17:28:20'),
(2, 'bachors', 'public', 'http://3.bp.blogspot.com/-c8O1QI1Ty24/UikpRn-WYLI/AAAAAAAAJ0Y/hCd3SVMejGQ/s1600/1cc767a412f68bc6ff6f26b526c4ecfd.jpeg', 'Karena akan terus di update & dikembangkan.', 'rooms', '2016-10-01 17:28:27'),
(3, 'bachors', 'public', 'http://3.bp.blogspot.com/-c8O1QI1Ty24/UikpRn-WYLI/AAAAAAAAJ0Y/hCd3SVMejGQ/s1600/1cc767a412f68bc6ff6f26b526c4ecfd.jpeg', 'Maka dari itu jangan lupa di fork & like ya sob :)', 'rooms', '2016-10-01 17:28:36'),
(4, 'bachors', 'public', 'http://3.bp.blogspot.com/-c8O1QI1Ty24/UikpRn-WYLI/AAAAAAAAJ0Y/hCd3SVMejGQ/s1600/1cc767a412f68bc6ff6f26b526c4ecfd.jpeg', 'https://github.com/bachors/Chat-Realtime', 'rooms', '2016-10-01 17:28:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ke` int(20) NOT NULL,
  `name` text NOT NULL,
  `avatar` varchar(500) NOT NULL,
  `login` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ke`, `name`, `avatar`, `login`, `status`) VALUES
(1, 'bachors', 'http://3.bp.blogspot.com/-c8O1QI1Ty24/UikpRn-WYLI/AAAAAAAAJ0Y/hCd3SVMejGQ/s1600/1cc767a412f68bc6ff6f26b526c4ecfd.jpeg', '2016-10-01 17:27:57', 'online');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ke`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ke` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
