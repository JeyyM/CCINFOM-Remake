'use client';

import { useState } from 'react';
import Link from 'next/link';
import DateDropdown from '../components/DateDropdowns';
import TimeDropdown from '../components/TimeDropdown';

export default function Appointments() {
  const [patientError, setPatientError] = useState('Select a patient.');
  const [staffError, setStaffError] = useState('Select a staff.');
  const [monthError, setMonthError] = useState('Schedule must be set in the future (validate)');

  const [testError, setTestError] = useState('Select at least 1 test');
  const [testError2, setTestError2] = useState('No more tests can be added');


  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const currentDay = String(today.getDate()).padStart(2, '0');

  const currentHour = today.getHours();
  const currentMinute = String(today.getMinutes()).padStart(2, '0');

  const period = currentHour >= 12 ? 'PM' : 'AM';
  const hour12 = currentHour % 12 === 0 ? 12 : currentHour % 12;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedHour, setSelectedHour] = useState(String(hour12).padStart(2, '0'));
  const [selectedMinute, setSelectedMinute] = useState(currentMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const [selectedTests, setSelectedTests] = useState([{ test: "", price: "0" }]);

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

  return (
    <div className='appointments-page background'>
      <div className='appointments-menu'>
        <div className='appointments-left'>
          <div className='appointments-section left'>
            <h3 className='warning-text'>{patientError}</h3>

            <div className='appointment-row'>
              <h2 className='text-medium-large appointment-header'>PATIENT</h2>
              <button className='pill-button-white text-medium-dark'>NEW</button>
              <button className='pill-button-transparent text-medium-white'>SELECT</button>
            </div>

            <h3 className='detail-text-white'>Surname, First Name</h3>
            <h3 className='detail-text-white'>firstnamesurname@gmail.com</h3>
          </div>

          <div className='appointments-section left'>
            <h3 className='warning-text'>{staffError}</h3>

            <div className='appointment-row'>
              <h2 className='text-medium-large appointment-header'>STAFF</h2>
              <button className='pill-button-transparent text-medium-white'>SELECT</button>
            </div>

            <h3 className='detail-text-white'>Surname, First Name</h3>
          </div>

          <div className='appointments-section left'>
            <h3 className='warning-text'>{monthError}</h3>

            <div className='appointment-row'>
              <h2 className='text-medium-large appointment-header'>SCHEDULE</h2>
            </div>

            <DateDropdown
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear} />

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
            <h2 className='text-medium-large appointment-header'>TESTS</h2>

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
                    style={{ width: '63%'}}>
                    <option value="">Select a test</option>
                    {availableTests.map((test, index) => (
                      <option key={index} value={test.name}>{test.name}</option>
                    ))}
                  </select>

                  <h2 className='dropdown-item-invert detail-text-light' style={{ width: '27%'}}>
                    {selectedTest.price ? `${selectedTest.price}` : ""}
                  </h2>

                  <button
                    onClick={() => removeTest(index)}
                    className='dropdown-item detail-text-dark'
                    style={{border:"none", width:"7%"}}>
                    -
                  </button>
                </div>
              ))}

              <button onClick={addTest} className='dropdown-item detail-text-dark add-test'>+</button>

              <h3 className='warning-text' style={{marginTop:"1rem"}}>{testError2}</h3>
            </div>
          </div>

          <div className='test-row'>
                <h2 className='text-medium-large' style={{whiteSpace:"nowrap"}}>TOTAL PRICE</h2>
                <h2 className='dropdown-item detail-text-dark' style={{width:"100%", textAlign:"center"}}>{getTotalPrice()}</h2>
            </div>

            <button className='text-medium-dark large-button-1' style={{width:"100%", textAlign:"center"}}>SET APPOINTMENT</button>

        </div>
      </div>

    </div>
  );
}
