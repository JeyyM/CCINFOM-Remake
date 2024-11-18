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

  return (
    <div className='appointments-page background'>
      <div className='appointments-menu'>
        <div className='appointments-left'>
          <div className='appointments-section'>
            <h3 className='warning-text'>{patientError}</h3>

            <div className='appointment-row'>
              <h2 className='text-medium-large appointment-header'>PATIENT</h2>
              <button className='pill-button-white text-medium-dark'>NEW</button>
              <button className='pill-button-transparent text-medium-white'>SELECT</button>
            </div>

            <h3 className='detail-text-white'>Surname, First Name</h3>
            <h3 className='detail-text-white'>firstnamesurname@gmail.com</h3>
          </div>

          <div className='appointments-section'>
            <h3 className='warning-text'>{staffError}</h3>

            <div className='appointment-row'>
              <h2 className='text-medium-large appointment-header'>STAFF</h2>
              <button className='pill-button-transparent text-medium-white'>SELECT</button>
            </div>

            <h3 className='detail-text-white'>Surname, First Name</h3>
          </div>

          <div className='appointments-section'>
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
                
              </div>
          </div>
        </div>
      </div>

    </div>
  );
}
