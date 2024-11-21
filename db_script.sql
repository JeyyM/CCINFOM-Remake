-- Drop existing tables if they exist
DROP TABLE IF EXISTS appointment_result;
DROP TABLE IF EXISTS REF_test_type;
DROP TABLE IF EXISTS bill;
DROP TABLE IF EXISTS appointment;
DROP TABLE IF EXISTS patient;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS REF_job;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS person_address;

-- Create person_address table
CREATE TABLE person_address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    building_number VARCHAR(45) NOT NULL,
    street_name VARCHAR(45) NOT NULL,
    barangay_name VARCHAR(45),
    city_name VARCHAR(45) NOT NULL,
    province_name VARCHAR(45) NOT NULL
);

-- Create person table
CREATE TABLE person (
    person_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(45) UNIQUE NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    sex ENUM('M', 'F') NOT NULL,
    address_id INT,
    FOREIGN KEY (address_id) REFERENCES person_address(address_id) ON DELETE SET NULL
);

-- Create REF_job table
CREATE TABLE REF_job (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    job_name VARCHAR(45) NOT NULL UNIQUE,
    job_description TEXT,
    min_salary DECIMAL(10, 2) CHECK (min_salary >= 0),
    max_salary DECIMAL(10, 2) CHECK (max_salary > min_salary)
);

-- Create staff table
CREATE TABLE staff (
    person_id INT PRIMARY KEY,
    job_id INT NOT NULL,
    monthly_salary DECIMAL(10, 2) NOT NULL CHECK (monthly_salary >= 0),
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES REF_job(job_id) ON DELETE RESTRICT
);

-- Create patient table
CREATE TABLE patient (
    person_id INT PRIMARY KEY,
    FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
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
    total_bill DECIMAL(10, 2) NOT NULL CHECK (total_bill >= 0),
    total_paid DECIMAL(10, 2) NOT NULL CHECK (total_paid >= 0 AND total_paid <= total_bill),
    status ENUM('Pending', 'Paid', 'Overdue') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id) ON DELETE CASCADE
);

-- Create REF_test_type table
CREATE TABLE REF_test_type (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(45) NOT NULL UNIQUE
);

-- Create appointment_result table
CREATE TABLE appointment_result (
    appointment_id INT NOT NULL,
    test_type INT NOT NULL,
    table_name VARCHAR(45) NOT NULL,
    fields_definition JSON NOT NULL,
    PRIMARY KEY (appointment_id, test_type),
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (test_type) REFERENCES REF_test_type(test_id) ON DELETE RESTRICT
);
