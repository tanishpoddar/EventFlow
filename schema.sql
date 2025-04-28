-- Create Database (Optional, if it doesn't exist)
-- CREATE DATABASE IF NOT EXISTS eventflow_db;
-- USE eventflow_db;

-- Drop existing tables in reverse order of dependency (if re-creating)
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Ticket;
DROP TABLE IF EXISTS `Order`; -- Use backticks for reserved keyword
DROP TABLE IF EXISTS Speaker;
DROP TABLE IF EXISTS Event;
DROP TABLE IF EXISTS Venue;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS TicketType;


-- Create User table
CREATE TABLE User (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Store hashed passwords
  user_type ENUM('organizer', 'attendee', 'administrator') NOT NULL
);

-- Create Venue table
CREATE TABLE Venue (
  venue_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  capacity INT,
  city VARCHAR(255),
  state VARCHAR(255),
  zip_code VARCHAR(255)
);

-- Create Event table
CREATE TABLE Event (
  event_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location_id INT NOT NULL,
  FOREIGN KEY (location_id) REFERENCES Venue(venue_id)
);

-- Create Order table
CREATE TABLE `Order` (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  date DATETIME NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Create Payment table
CREATE TABLE Payment (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  payment_method ENUM('credit card', 'paypal', 'other') NOT NULL,
  transaction_id VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES `Order`(order_id)
);

-- Add payment_id foreign key to Order table
ALTER TABLE `Order` ADD COLUMN payment_id INT;
ALTER TABLE `Order` ADD FOREIGN KEY (payment_id) REFERENCES Payment(payment_id);

-- Create Ticket table
CREATE TABLE Ticket (
  ticket_id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  order_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type ENUM('general admission', 'vip', 'other') NOT NULL,
  seat_number INT,
  FOREIGN KEY (event_id) REFERENCES Event(event_id),
  FOREIGN KEY (order_id) REFERENCES `Order`(order_id)
);

-- Create Speaker table
CREATE TABLE Speaker (
  speaker_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  event_id INT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES Event(event_id)
);

-- Create TicketType table
CREATE TABLE TicketType (
  ticket_type_id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES Event(event_id)
);

-- Example Data (Optional)
-- INSERT INTO User (name, email, password, user_type) VALUES
-- ('Organizer Bob', 'organizer@example.com', '$2b$12$EXAMPLEHASH...', 'organizer'), -- Replace with actual bcrypt hash
-- ('Attendee Alice', 'attendee@example.com', '$2b$12$EXAMPLEHASH...', 'attendee'); -- Replace with actual bcrypt hash

-- INSERT INTO Venue (name, address, capacity, city, state, zip_code) VALUES
-- ('Downtown Conference Hall', '123 Main St', 500, 'Anytown', 'CA', '90210'),
-- ('City Park Amphitheater', '456 Park Ave', 2000, 'Metropolis', 'NY', '10001');

-- INSERT INTO Event (name, description, date, time, location_id) VALUES
-- ('Annual Tech Summit 2024', 'The future of tech is here.', '2024-10-15', '09:00:00', 1),
-- ('Summer Music Festival', 'Live bands all day long.', '2024-08-20', '12:00:00', 2);
