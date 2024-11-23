-- Populating the person_address table
USE medical_app;
-- INSERT INTO person_address (address_id, building_number, street_name, barangay_name, city_name, province_name)
-- VALUES
-- (1, '123', 'Rizal Avenue'),
-- (2, '456', 'Mabini Street', ),
-- (3, '789', 'Bonifacio Road', ),
-- (4, '321', 'Katipunan Avenue', ),
-- (5, '654', 'Ortigas Avenue', ),
-- (6, '987', 'Shaw Boulevard', ),
-- (7, '111', 'Taft Avenue', ),
-- (8, '222', 'Aurora Boulevard', ),
-- (9, '333', 'P. Tuazon Blvd', ),
-- (10, '444', 'Quirino Highway', ),
-- (11, '567', 'Roxas Boulevard',),
-- (12, '678', 'Kalayaan Avenue', ),
-- (13, '789', 'Gil Puyat Avenue', ),
-- (14, '890', 'C5 Extension', ),
-- (15, '123', 'Macapagal Blvd', ),
-- (16, '234', 'Aguinaldo Highway', ),
-- (17, '345', 'Coastal Road', ),
-- (18, '456', 'Governor Drive', ),
-- (19, '567', 'Palico Road', ),
-- (20, '678', 'San Jose Road', );

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

-- Populating the REF_job table
-- INSERT INTO REF_job (job_id, job_name, job_description, min_salary, max_salary)
-- VALUES
-- (1, 'Doctor', 'Handles patient diagnosis and treatment', 50000.00, 120000.00),
-- (2, 'Nurse', 'Assists doctors and manages patient care', 30000.00, 70000.00),
-- (3, 'Lab Technician', 'Conducts and analyzes lab tests', 40000.00, 80000.00),
-- (4, 'Admin Staff', 'Handles administrative tasks', 20000.00, 60000.00),
-- (5, 'Pharmacist', 'Prepares and dispenses medications', 45000.00, 90000.00),
-- (6, 'Radiologist', 'Analyzes medical imaging', 50000.00, 100000.00),
-- (7, 'Therapist', 'Assists patients with therapy sessions', 30000.00, 70000.00),
-- (8, 'Physician Assistant', 'Supports physicians with procedures', 40000.00, 85000.00);

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
(9, 14, 9, '2024-02-04 10:00:00', 'Cancelled', NOW(), NOW()),
(10, 5, 3, '2024-02-05 13:45:00', 'Scheduled', NOW(), NOW()),
(11, 10, 12, '2024-02-06 16:00:00', 'Completed', NOW(), NOW()),
(12, 17, 16, '2024-02-07 15:30:00', 'Completed', NOW(), NOW()),
(13, 18, 3, '2024-02-08 12:00:00', 'Scheduled', NOW(), NOW()),
(14, 11, 1, '2024-02-09 09:30:00', 'Scheduled', NOW(), NOW()),
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
(7, 'Lipid Profile');


-- Populating the appointment_result table
-- INSERT INTO appointment_result (appointment_id, test_type, table_name, fields_definition)
-- VALUES
-- (1, 1, 'blood_test_results', '{"hemoglobin": "12.5", "RBC": "4.7"}'),
-- (2, 2, 'urine_test_results', '{"protein": "Normal", "sugar": "Normal"}'),
-- (3, 3, 'xray_results', '{"findings": "Normal", "notes": "No abnormalities"}'),
-- (4, 4, 'mri_results', '{"findings": "Minor disc bulge", "notes": "Follow-up recommended"}'),
-- (5, 5, 'ctscan_results', '{"findings": "No issues", "notes": "Clear"}'),
-- (6, 6, 'ekg_results', '{"heart_rate": "75 bpm", "rhythm": "Normal"}'),
-- (7, 7, 'lipid_results', '{"cholesterol": "190 mg/dL", "triglycerides": "150 mg/dL"}'),
-- (8, 1, 'blood_test_results', '{"hemoglobin": "13.0", "RBC": "4.5"}'),
-- (9, 2, 'urine_test_results', '{"protein": "Normal", "sugar": "Trace"}'),
-- (10, 3, 'xray_results', '{"findings": "Mild scoliosis", "notes": "Observation required"}'),
-- (11, 4, 'mri_results', '{"findings": "Minor disc bulge", "notes": "Follow-up recommended"}'),
-- (12, 5, 'ctscan_results', '{"findings": "No issues", "notes": "Clear"}'),
-- (13, 6, 'ekg_results', '{"heart_rate": "75 bpm", "rhythm": "Normal"}'),
-- (14, 7, 'lipid_results', '{"cholesterol": "190 mg/dL", "triglycerides": "150 mg/dL"}'),
-- (15, 3, 'xray_results', '{"findings": "Normal", "notes": "No abnormalities"}');

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