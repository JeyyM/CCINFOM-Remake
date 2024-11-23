DROP DATABASE IF EXISTS medical_app;
CREATE DATABASE medical_app;
USE medical_app;

-- Create person table
CREATE TABLE person (
    person_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(45) UNIQUE NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    sex ENUM('M', 'F') NOT NULL,
    street_name VARCHAR(45) NOT NULL,
	city_name VARCHAR(45) NOT NULL,
    province_name VARCHAR(45) NOT NULL
);

-- Create patient table
CREATE TABLE patient (
     person_id INT PRIMARY KEY,
     FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);

-- Create staff table
CREATE TABLE staff (
    person_id INT PRIMARY KEY,
    job_name VARCHAR(50) NOT NULL,
	monthly_salary DECIMAL(10, 2) NOT NULL,
    status ENUM('Hired', 'Fired') NOT NULL DEFAULT 'Active',
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE,
    CONSTRAINT valid_salary CHECK (monthly_salary >= 0)
);

-- Create appointment table
CREATE TABLE appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    staff_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(person_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(person_id) ON DELETE RESTRICT
);

-- Create bill table
CREATE TABLE bill (
    appointment_id INT PRIMARY KEY,
    total_bill DECIMAL(10, 2) NOT NULL,
    total_paid DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Paid', 'Overdue') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id) ON DELETE CASCADE,
    CONSTRAINT valid_bill CHECK (total_bill >= 0),
    CONSTRAINT valid_paid CHECK (total_paid >= 0 AND total_paid <= total_bill)
);

-- Create REF_test_type table
CREATE TABLE REF_test_type (
    test_name VARCHAR(45) PRIMARY KEY,
    test_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT valid_price CHECK (test_price >= 0)
);

CREATE TABLE junction_table (
    appointment_id INT PRIMARY KEY,
    test_name VARCHAR(45) NOT NULL UNIQUE,
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (test_name) REFERENCES REF_test_type(test_name) ON DELETE RESTRICT
);