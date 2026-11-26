CREATE DATABASE IF NOT EXISTS smart_hotel; USE smart_hotel;
CREATE TABLE roles(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) UNIQUE NOT NULL);
INSERT INTO roles(name) VALUES('super_admin'),('manager'),('receptionist'),('accountant'),('housekeeping'),('restaurant');
CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(100) NOT NULL, username VARCHAR(50) UNIQUE NOT NULL,
 password_hash VARCHAR(100) NOT NULL, role_id INT NOT NULL, active TINYINT DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(role_id) REFERENCES roles(id));
CREATE TABLE room_types(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) UNIQUE NOT NULL);
INSERT INTO room_types(name) VALUES('Single'),('Double'),('Twin'),('Deluxe'),('Executive'),('Suite');
CREATE TABLE rooms(id INT AUTO_INCREMENT PRIMARY KEY, room_number VARCHAR(10) UNIQUE NOT NULL, type_id INT NOT NULL,
 price DECIMAL(10,2) NOT NULL, description TEXT, status ENUM('Available','Occupied','Reserved','Maintenance','Cleaning') DEFAULT 'Available',
 FOREIGN KEY(type_id) REFERENCES room_types(id), INDEX(status));
CREATE TABLE customers(id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(100) NOT NULL, email VARCHAR(100), phone VARCHAR(30) NOT NULL,
 address VARCHAR(255), id_number VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX(full_name), INDEX(phone));
CREATE TABLE bookings(id INT AUTO_INCREMENT PRIMARY KEY, customer_id INT NOT NULL, room_id INT NOT NULL, check_in DATE NOT NULL, check_out DATE NOT NULL,
 guests INT DEFAULT 1, total_price DECIMAL(10,2) NOT NULL, status ENUM('Confirmed','CheckedIn','CheckedOut','Cancelled') DEFAULT 'Confirmed',
 created_by INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(customer_id) REFERENCES customers(id), FOREIGN KEY(room_id) REFERENCES rooms(id), FOREIGN KEY(created_by) REFERENCES users(id),
 INDEX(room_id,check_in,check_out), INDEX(status));
CREATE TABLE check_ins(id INT AUTO_INCREMENT PRIMARY KEY, booking_id INT UNIQUE NOT NULL, staff_id INT, at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(booking_id) REFERENCES bookings(id));
CREATE TABLE check_outs(id INT AUTO_INCREMENT PRIMARY KEY, booking_id INT UNIQUE NOT NULL, staff_id INT, at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(booking_id) REFERENCES bookings(id));
CREATE TABLE invoices(id INT AUTO_INCREMENT PRIMARY KEY, booking_id INT UNIQUE NOT NULL, total DECIMAL(10,2) NOT NULL, paid DECIMAL(10,2) DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(booking_id) REFERENCES bookings(id));
CREATE TABLE payments(id INT AUTO_INCREMENT PRIMARY KEY, invoice_id INT NOT NULL, amount DECIMAL(10,2) NOT NULL, method ENUM('Cash','Card') NOT NULL,
 reference VARCHAR(60), received_by INT, paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(invoice_id) REFERENCES invoices(id), FOREIGN KEY(received_by) REFERENCES users(id), INDEX(paid_at));
