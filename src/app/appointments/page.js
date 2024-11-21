'use client';

import { useState } from 'react';
import Link from 'next/link';
import TimeDropdown from '../components/TimeDropdown';
import PatientForm from '../components/PatientForm';
import SelectPatients from '../components/SelectPatients';
import SelectEmployee from '../components/SelectEmployee';

export default function Appointments() {
  const [patientError, setPatientError] = useState('Select a patient.');
  const [staffError, setStaffError] = useState('Select a staff.');
  const [monthError, setMonthError] = useState('Schedule must be set in the future (validate)');

  const [testError, setTestError] = useState('Select at least 1 test');
  const [testError2, setTestError2] = useState('No more tests can be added');

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [keptPatient, setKeptPatient] = useState(null);
  const [selectingPatient, setSelectingPatient] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const currentDay = String(today.getDate()).padStart(2, '0');
  const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

  const currentHour = today.getHours();
  const currentMinute = String(today.getMinutes()).padStart(2, '0');

  const period = currentHour >= 12 ? 'PM' : 'AM';
  const hour12 = currentHour % 12 === 0 ? 12 : currentHour % 12;

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const [selectedHour, setSelectedHour] = useState(String(hour12).padStart(2, '0'));
  const [selectedMinute, setSelectedMinute] = useState(currentMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const [selectedTests, setSelectedTests] = useState([{ test: "", price: "0" }]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployees, setShowEmployees] = useState(false);

  const patientData = [
    {
      id: 1,
      last_name: "Smith",
      first_name: "John",
      birthday: "1990-01-15",
      phone: "09171234567",
      email: "john.smith@gmail.com",
      sex: "M",
      street: "123 Elm Street",
      city: "Makati",
      province: "Metro Manila",
    },
    {
      id: 2,
      last_name: "Doe",
      first_name: "Jane",
      birthday: "1985-03-22",
      phone: "09181234567",
      email: "jane.doe@gmail.com",
      sex: "F",
      street: "456 Pine Avenue",
      city: "Quezon City",
      province: "Metro Manila",
    },
    {
      id: 3,
      last_name: "Garcia",
      first_name: "Carlos",
      birthday: "1992-07-18",
      phone: "09201234567",
      email: "carlos.garcia@gmail.com",
      sex: "M",
      street: "789 Oak Lane",
      city: "Pasig",
      province: "Metro Manila",
    },
    {
      id: 4,
      last_name: "Reyes",
      first_name: "Maria",
      birthday: "1998-11-30",
      phone: "09192234567",
      email: "maria.reyes@gmail.com",
      sex: "F",
      street: "321 Maple Road",
      city: "Cebu City",
      province: "Cebu",
    },
    {
      id: 5,
      last_name: "Tan",
      first_name: "Alexander",
      birthday: "1980-06-12",
      phone: "09193334567",
      email: "alex.tan@gmail.com",
      sex: "M",
      street: "654 Birch Boulevard",
      city: "Davao City",
      province: "Davao del Sur",
    },
    {
      id: 6,
      last_name: "Santos",
      first_name: "Angela",
      birthday: "1995-04-25",
      phone: "09194434567",
      email: "angela.santos@gmail.com",
      sex: "F",
      street: "987 Cedar Court",
      city: "Taguig",
      province: "Metro Manila",
    },
    {
      id: 7,
      last_name: "Luna",
      first_name: "Roberto",
      birthday: "1983-09-05",
      phone: "09195534567",
      email: "roberto.luna@gmail.com",
      sex: "M",
      street: "111 Willow Drive",
      city: "Baguio City",
      province: "Benguet",
    },
    {
      id: 8,
      last_name: "Villanueva",
      first_name: "Sophia",
      birthday: "1999-02-14",
      phone: "09196634567",
      email: "sophia.villanueva@gmail.com",
      sex: "F",
      street: "222 Spruce Avenue",
      city: "Iloilo City",
      province: "Iloilo",
    },
    {
      id: 9,
      last_name: "Cruz",
      first_name: "Miguel",
      birthday: "1993-12-10",
      phone: "09197734567",
      email: "miguel.cruz@gmail.com",
      sex: "M",
      street: "333 Aspen Street",
      city: "Zamboanga City",
      province: "Zamboanga del Sur",
    },
    {
      id: 10,
      last_name: "Fernandez",
      first_name: "Isabella",
      birthday: "2000-08-08",
      phone: "09198834567",
      email: "isabella.fernandez@gmail.com",
      sex: "F",
      street: "444 Palm Road",
      city: "Bacolod City",
      province: "Negros Occidental",
    },
  ];

  const employeeData = [
    {
      id: 1,
      last_name: "EMPLOYESmith",
      first_name: "John",
      birthday: "1990-01-15",
      phone: "09171234567",
      email: "john.smith@gmail.com",
      sex: "M",
      street: "123 Elm Street",
      city: "Makati",
      province: "Metro Manila",
      hire_date: "2015-06-01",
      job: "Software Engineer",
      manager: 3,
      monthly_salary: 75000,
      status: true,
    },
    {
      id: 2,
      last_name: "EMPLOYEDoe",
      first_name: "Jane",
      birthday: "1985-03-22",
      phone: "09181234567",
      email: "jane.doe@gmail.com",
      sex: "F",
      street: "456 Pine Avenue",
      city: "Quezon City",
      province: "Metro Manila",
      hire_date: "2012-04-15",
      job: "Project Manager",
      manager: null,
      monthly_salary: 90000,
      status: true,
    },
    {
      id: 3,
      last_name: "EMPLOYEGarcia",
      first_name: "Carlos",
      birthday: "1992-07-18",
      phone: "09201234567",
      email: "carlos.garcia@gmail.com",
      sex: "M",
      street: "789 Oak Lane",
      city: "Pasig",
      province: "Metro Manila",
      hire_date: "2018-09-20",
      job: "Team Lead",
      manager: 2,
      monthly_salary: 85000,
      status: true,
    },
    {
      id: 4,
      last_name: "EMPLOYEReyes",
      first_name: "Maria",
      birthday: "1998-11-30",
      phone: "09192234567",
      email: "maria.reyes@gmail.com",
      sex: "F",
      street: "321 Maple Road",
      city: "Cebu City",
      province: "Cebu",
      hire_date: "2021-05-10",
      job: "QA Engineer",
      manager: 3,
      monthly_salary: 60000,
      status: true,
    },
    {
      id: 5,
      last_name: "EMPLOYETan",
      first_name: "Alexander",
      birthday: "1980-06-12",
      phone: "09193334567",
      email: "alex.tan@gmail.com",
      sex: "M",
      street: "654 Birch Boulevard",
      city: "Davao City",
      province: "Davao del Sur",
      hire_date: "2010-02-18",
      job: "DevOps Engineer",
      manager: 2,
      monthly_salary: 78000,
      status: false,
    },
    {
      id: 6,
      last_name: "EMPLOYESantos",
      first_name: "Angela",
      birthday: "1995-04-25",
      phone: "09194434567",
      email: "angela.santos@gmail.com",
      sex: "F",
      street: "987 Cedar Court",
      city: "Taguig",
      province: "Metro Manila",
      hire_date: "2017-11-01",
      job: "UI/UX Designer",
      manager: 3,
      monthly_salary: 68000,
      status: true,
    },
    {
      id: 7,
      last_name: "EMPLOYELuna",
      first_name: "Roberto",
      birthday: "1983-09-05",
      phone: "09195534567",
      email: "roberto.luna@gmail.com",
      sex: "M",
      street: "111 Willow Drive",
      city: "Baguio City",
      province: "Benguet",
      hire_date: "2008-07-10",
      job: "Systems Architect",
      manager: 2,
      monthly_salary: 120000,
      status: false,
    },
    {
      id: 8,
      last_name: "EMPLOYEVillanueva",
      first_name: "Sophia",
      birthday: "1999-02-14",
      phone: "09196634567",
      email: "sophia.villanueva@gmail.com",
      sex: "F",
      street: "222 Spruce Avenue",
      city: "Iloilo City",
      province: "Iloilo",
      hire_date: "2022-01-05",
      job: "Intern",
      manager: 6,
      monthly_salary: 20000,
      status: true,
    },
    {
      id: 9,
      last_name: "EMPLOYECruz",
      first_name: "Miguel",
      birthday: "1993-12-10",
      phone: "09197734567",
      email: "miguel.cruz@gmail.com",
      sex: "M",
      street: "333 Aspen Street",
      city: "Zamboanga City",
      province: "Zamboanga del Sur",
      hire_date: "2019-03-18",
      job: "Backend Developer",
      manager: 3,
      monthly_salary: 71000,
      status: true,
    },
    {
      id: 10,
      last_name: "EMPLOYEFernandez",
      first_name: "Isabella",
      birthday: "2000-08-08",
      phone: "09198834567",
      email: "isabella.fernandez@gmail.com",
      sex: "F",
      street: "444 Palm Road",
      city: "Bacolod City",
      province: "Negros Occidental",
      hire_date: "2023-06-01",
      job: "Junior Developer",
      manager: 9,
      monthly_salary: 50000,
      status: true,
    },
  ];

  const [patientList, setPatientList] = useState(patientData);
  const [employeeList, setEmployeeList] = useState(employeeData);

  const availableTests = [
    { name: "Blood Test 1", price: "1000" },
    { name: "Blood Test 2", price: "1500" },
    { name: "Blood Test 3", price: "2000" },
    { name: "Blood Test 4", price: "2500" },
    { name: "Blood Test 5", price: "3000" }
  ];

  const handleTestChange = (index, selectedTest) => {
    const updatedTests = [...selectedTests];
    const testDetails = availableTests.find(test => test.name === selectedTest);

    if (testDetails) {
      updatedTests[index] = { test: testDetails.name, price: testDetails.price };
    } else {
      updatedTests[index] = { test: "", price: "0" };
    }

    setSelectedTests(updatedTests);
  };

  const addTest = () => {
    setSelectedTests([...selectedTests, { test: "", price: "0" }]);
  };

  const removeTest = (index) => {
    const updatedTests = selectedTests.filter((test, i) => i !== index);
    setSelectedTests(updatedTests);
  };

  const getTotalPrice = () => {
    return selectedTests.reduce((sum, test) => sum + parseInt(test.price), 0);
  };

  const handleSavePatient = (patient) => {
    if (patient.id) {
      // lets save the patient saving for after the submission
      // setPatientList((prev) =>
      //   prev.map((p) => (p.id === patient.id ? patient : p))
      // );
      setKeptPatient(patient);
    } else {
      const newId = patientList.length ? Math.max(...patientList.map((p) => p.id)) + 1 : 1;
      const newPatient = { ...patient, id: newId };
      setPatientList((prev) => [...prev, newPatient]);
      setKeptPatient(newPatient);
    }
  };

  return (
    <div className='appointments-page background'>
      {selectedPatient && (
        <PatientForm
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          patientList={patientList}
          onClose={() => setSelectedPatient(null)}
          handleSave={handleSavePatient}
        />)}

      {selectingPatient && (
        <SelectPatients
          patientList={patientList}
          onClose={() => setSelectingPatient(false)}
          handleSave={handleSavePatient}
        />)}

      {showEmployees && (
        <SelectEmployee
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          employeeList={employeeList}
          onClose={() => setShowEmployees(false)}
          handleSave={(emp) => {
            setSelectedEmployee(emp);
            setShowEmployees(false);
          }}
          type={"select"}
        />)}

      <div className='appointments-menu'>
        <div className='appointments-left'>
          <div className='appointments-section left'>
            <h3 className='warning-text'>{patientError}</h3>

            <div className='appointment-row'>
              <h2 className='text-large-white appointment-header'>PATIENT</h2>
              <button className='pill-button-white text-medium-dark' onClick={() => setSelectedPatient({})}>NEW</button>
              <button className='pill-button-transparent text-medium-white' onClick={() => setSelectingPatient(true)}>SELECT</button>
            </div>

            {keptPatient ? <>
              <h3 className='detail-text-white'>{keptPatient.last_name}, {keptPatient.first_name}</h3>
              <h3 className='detail-text-white'>{keptPatient.email}</h3>
            </> : <h3 className='detail-text-white'>-</h3>}
          </div>

          <div className='appointments-section left'>
            <h3 className='warning-text'>{staffError}</h3>

            <div className='appointment-row'>
              <h2 className='text-large-white appointment-header'>STAFF</h2>
              <button className='pill-button-transparent text-medium-white' onClick={() => setShowEmployees(true)}>SELECT</button>
            </div>

            {selectedEmployee ? <>
              <h3 className='detail-text-white'>{selectedEmployee.last_name}, {selectedEmployee.first_name}</h3>
              <h3 className='detail-text-white'>{selectedEmployee.email}</h3>
              <h3 className='detail-text-white'>{selectedEmployee.job}</h3>
            </> : <h3 className='detail-text-white'>-</h3>}
          </div>

          <div className='appointments-section left'>
            <h3 className='warning-text'>{monthError}</h3>

            <div className='appointment-row'>
              <h2 className='text-large-white appointment-header'>SCHEDULE</h2>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="form-input detail-text-dark"
              style={{ width: "35rem", textAlign: "center" }}
            />

            <TimeDropdown
              selectedHour={selectedHour}
              setSelectedHour={setSelectedHour}
              selectedMinute={selectedMinute}
              setSelectedMinute={setSelectedMinute}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod} />
          </div>

        </div>
        <div className='appointments-right'>
          <div className='appointments-section'>
            <h3 className='warning-text'>{testError}</h3>
            <h2 className='text-large-white appointment-header'>TESTS</h2>

            <div className='test-selection'>
              <div className='test-row'>
                <h2 className='detail-text-white' style={{ width: "63%" }}>Name</h2>
                <h2 className='detail-text-white' style={{ width: "27%" }}>Price</h2>
                <h2 className='detail-text-white' style={{ width: "7%" }}></h2>
              </div>

              {selectedTests.map((selectedTest, index) => (
                <div className='test-row' key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <select
                    value={selectedTest.test}
                    onChange={(e) => handleTestChange(index, e.target.value)}
                    className="dropdown-item detail-text-dark"
                    style={{ width: '63%' }}>
                    <option value="">Select a test</option>
                    {availableTests.map((test, index) => (
                      <option key={index} value={test.name}>{test.name}</option>
                    ))}
                  </select>

                  <h2 className='dropdown-item-invert detail-text-light' style={{ width: '27%' }}>
                    {selectedTest.price ? `${selectedTest.price}` : ""}
                  </h2>

                  <button
                    onClick={() => removeTest(index)}
                    className='dropdown-item detail-text-dark'
                    style={{ border: "none", width: "7%" }}>
                    -
                  </button>
                </div>
              ))}

              <button onClick={addTest} className='dropdown-item detail-text-dark add-test'>+</button>

              <h3 className='warning-text' style={{ marginTop: "1rem" }}>{testError2}</h3>
            </div>
          </div>

          <div className='test-row'>
            <h2 className='text-large-white' style={{ whiteSpace: "nowrap" }}>TOTAL PRICE</h2>
            <h2 className='dropdown-item detail-text-dark' style={{ width: "100%", textAlign: "center" }}>{getTotalPrice()}</h2>
          </div>

          <button className='text-medium-dark large-button-1' style={{ width: "100%", textAlign: "center" }}>SET APPOINTMENT</button>

        </div>
      </div>

    </div>
  );
}
