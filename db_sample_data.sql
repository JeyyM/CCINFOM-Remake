-- Populating the person_address table
USE medical_app;

-- Populating the person table
INSERT INTO person (person_id, first_name, last_name, date_of_birth, phone_number, email, sex, street_name, city_name, province_name)
VALUES
(1, 'Juan', 'Dela Cruz', '1985-02-14', '09171234567', 'juan.delacruz@gmail.com', 'M', 'Barangay 1', 'Quezon City', 'Metro Manila'),
(2, 'Maria', 'Santos', '1990-05-20', '09181234568', 'maria.santos@yahoo.com', 'F', 'Barangay 2', 'Makati City', 'Metro Manila'),
(3, 'Jose', 'Reyes', '1978-11-25', '09221234569', 'jose.reyes@hotmail.com', 'M', 'Barangay 3', 'Pasig City', 'Metro Manila'),
(4, 'Ana', 'Luna', '1995-03-10', '09281234570', 'ana.luna@outlook.com', 'F', 'Barangay Loyola', 'Quezon City', 'Metro Manila'),
(5, 'Pedro', 'Garcia', '1980-09-15', '09301234571', 'pedro.garcia@gmail.com', 'M', 'Barangay San Antonio', 'San Juan City', 'Metro Manila'),
(6, 'Karla', 'Gutierrez', '1998-07-22', '09321234572', 'karla.gutierrez@yahoo.com', 'F', 'Barangay Wack-Wack', 'Mandaluyong City', 'Metro Manila'),
(7, 'Carlo', 'Ramos', '1993-01-30', '09151234573', 'carlo.ramos@gmail.com', 'M', 'Barangay Vito Cruz', 'Manila City', 'Metro Manila'),
(8, 'Lorna', 'Castillo', '1987-04-12', '09481234574', 'lorna.castillo@ymail.com', 'F', 'Barangay E. Rodriguez', 'Cubao', 'Metro Manila'),
(9, 'Dante', 'Rivera', '1982-06-18', '09211234575', 'dante.rivera@protonmail.com', 'M', 'Barangay Project 4', 'Quezon City', 'Metro Manila'),
(10, 'Cecilia', 'Mendoza', '1991-10-25', '09391234576', 'cecilia.mendoza@gmail.com', 'F', 'Barangay Bagbag', 'Caloocan City', 'Metro Manila'),
(11, 'Ricardo', 'Manalo', '1988-05-13', '09151234801', 'ricardo.manalo@gmail.com', 'M', 'Barangay Libertad', 'Pasay City', 'Metro Manila'),
(12, 'Angela', 'Cruz', '1993-12-17', '09181234802', 'angela.cruz@yahoo.com', 'F', 'Barangay West Rembo', 'Taguig City', 'Metro Manila'),
(13, 'Victor', 'Alcantara', '1985-03-07', '09221234803', 'victor.alcantara@gmail.com', 'M', 'Barangay Sta. Cruz', 'Pasay City', 'Metro Manila'),
(14, 'Sophia', 'Bautista', '1997-08-19', '09281234804', 'sophia.bautista@outlook.com', 'F', 'Barangay Signal Village', 'Taguig City', 'Metro Manila'),
(15, 'Fernando', 'De Leon', '1979-11-03', '09301234805', 'fernando.deleon@yahoo.com', 'M', 'Barangay Tambo', 'Paranaque City', 'Metro Manila'),
(16, 'Patricia', 'Gomez', '1992-01-26', '09321234806', 'patricia.gomez@gmail.com', 'F', 'Barangay Bayan Luma', 'Imus City', 'Cavite'),
(17, 'Antonio', 'Santos', '1983-06-15', '09151234807', 'antonio.santos@yahoo.com', 'M', 'Barangay Talaba', 'Bacoor City', 'Cavite'),
(18, 'Lorena', 'Silva', '1986-09-30', '09481234808', 'lorena.silva@ymail.com', 'F', 'Barangay San Agustin', 'Dasmarinas City', 'Cavite'),
(19, 'Carlos', 'Diaz', '1981-07-04', '09211234809', 'carlos.diaz@hotmail.com', 'M', 'Barangay Palico', 'General Trias', 'Cavite'),
(20, 'Emily', 'Villanueva', '1994-02-22', '09391234810', 'emily.villanueva@gmail.com', 'F', 'Barangay San Jose', 'Noveleta', 'Cavite');

-- Populating the staff table
INSERT INTO staff (person_id, job_name, monthly_salary, status)
VALUES
(1, 'Doctor', 50000.00, 'Hired'),
(3, 'Nurse', 60000.00, 'Hired'),
(4, 'Lab Technician', 55000.00, 'Hired'),
(6, 'Pharmacist', 48000.00, 'Hired'),
(9, 'Radiologist', 53000.00, 'Hired'),
(12, 'Therapist', 42000.00, 'Hired'),
(15, 'Physician Assistant', 47000.00, 'Fired'),
(16, 'Admin Staff', 51000.00, 'Hired');


-- Populating the patient table
INSERT INTO patient (person_id)
VALUES
(2), 
(5), 
(7), 
(8), 
(10),
(11), 
(13), 
(14), 
(17), 
(18), 
(19), 
(20);

-- Populating the appointment table
INSERT INTO appointment (appointment_id, patient_id, staff_id, appointment_date, status, created_at, updated_at)
VALUES
(1, 2, 1, '2024-01-20 10:30:00', 'Scheduled', NOW(), NOW()),
(2, 5, 6, '2024-01-21 14:00:00', 'Completed', NOW(), NOW()),
(3, 7, 4, '2024-01-22 09:00:00', 'Scheduled', NOW(), NOW()),
(4, 8, 12, '2024-01-23 16:00:00', 'Cancelled', NOW(), NOW()),
(5, 10, 1, '2024-01-24 11:00:00', 'Scheduled', NOW(), NOW()),
(6, 11, 3, '2024-02-01 09:00:00', 'Scheduled', NOW(), NOW()),
(7, 5, 4, '2024-02-02 11:30:00', 'Completed', NOW(), NOW()),
(8, 13, 6, '2024-02-03 14:15:00', 'Scheduled', NOW(), NOW()),
(9, 14, 9, '2024-02-03 10:00:00', 'Cancelled', NOW(), NOW()),
(10, 5, 3, '2024-02-05 13:45:00', 'Scheduled', NOW(), NOW()),
(11, 10, 12, '2024-02-06 16:00:00', 'Completed', NOW(), NOW()),
(12, 17, 16, '2024-02-07 15:30:00', 'Completed', NOW(), NOW()),
(13, 18, 3, '2024-02-08 12:00:00', 'Scheduled', NOW(), NOW()),
(14, 11, 1, '2024-02-10 09:30:00', 'Scheduled', NOW(), NOW()),
(15, 20, 6, '2024-02-10 08:15:00', 'Scheduled', NOW(), NOW());
 
-- Populating the REF_test_type table
INSERT INTO REF_test_type (test_name, test_price)
VALUES
('Blood Test', 1500.00),
('Urine Test', 2000.00),
('X-Ray', 1200),
('MRI', 1800.00),
('CT Scan', 2200.00),
('EKG', 2500.00),
('Lipid Profile', 3000.00);

INSERT INTO junction_table (appointment_id, test_name)
VALUES
(1, 'Blood Test'),
(2, 'Urine Test'),
(3, 'X-Ray'),
(4, 'MRI'),
(5, 'CT Scan'),
(6, 'EKG'),
(7, 'EKG');

-- Populating the bill table
INSERT INTO bill (appointment_id, total_bill, total_paid, status)
VALUES
(1, 1500.00, 1500.00, 'Paid'),
(2, 2000.00, 2000.00, 'Paid'),
(3, 1200.00, 600.00, 'Pending'),
(4, 1800.00, 0.00, 'Overdue'),
(5, 2200.00, 2200.00, 'Paid'),
(6, 2500.00, 2500.00, 'Paid'),
(7, 3000.00, 1500.00, 'Pending'),
(8, 1800.00, 0.00, 'Overdue'),
(9, 2200.00, 2200.00, 'Paid'),
(10, 1900.00, 1900.00, 'Paid'),
(11, 1200.00, 600.00, 'Pending'),
(12, 1800.00, 0.00, 'Overdue'),
(13, 2200.00, 2200.00, 'Paid'),
(14, 2500.00, 2500.00, 'Paid'),
(15, 2000.00, 2000.00, 'Paid');

SELECT CONCAT(person.first_name, ' ', person.last_name) AS staff_name, SUM(bill.total_paid) AS total_revenue FROM staff
JOIN
	person ON staff.person_id = person.person_id
JOIN
  appointment ON staff.person_id = appointment.staff_id
JOIN
	bill ON appointment.appointment_id = bill.appointment_id
GROUP BY
	staff_name
ORDER BY
	total_revenue DESC;