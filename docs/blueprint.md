# **App Name**: EventFlow

## Core Features:

- Role-Based Authentication: User authentication with two roles: attendee and organizer.
- Event and Ticket Management: Attendees can browse events and book tickets. Organizers can manage (CRUD) events, venues, speakers, and tickets.

## Style Guidelines:

- Primary color: Teal (#008080) for a professional and trustworthy feel.
- Secondary color: Light gray (#F0F0F0) for backgrounds and subtle contrasts.
- Accent: Orange (#FFA500) for call-to-action buttons and important highlights.
- Clean and responsive layout for optimal viewing on different devices.
- Use consistent and clear icons for navigation and actions.
- Subtle transitions and animations to enhance user experience.

## Original User Request:
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

-- Create User table
CREATE TABLE User (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
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

-- Create Ticket table
CREATE TABLE Ticket (
  ticket_id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  order_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type ENUM('general admission', 'vip', 'other') NOT NULL,
  seat_number INT,
  FOREIGN KEY (event_id) REFERENCES Event(event_id),
  FOREIGN KEY (order_id) REFERENCES Order(order_id)
);

-- Create Order table
CREATE TABLE Order (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  date DATETIME NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  payment_id INT,
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  FOREIGN KEY (payment_id) REFERENCES Payment(payment_id)
);

-- Create Payment table
CREATE TABLE Payment (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  payment_method ENUM('credit card', 'paypal', 'other') NOT NULL,
  transaction_id VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES Order(order_id)
);

-- Create Speaker table
CREATE TABLE Speaker (
  speaker_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  event_id INT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES Event(event_id)
);


i have this mysql database setup, i want to create flask backend and html css js frontend to make this work fully

login should be of two types 
organizer & attendee
attendee can only book tickets, while organizer can do all the CRUD commands on all the tables
  