import React, { useState } from 'react';

// FOR HR, MIN, AM/PM INPUT
export default function TimeDropdown({
  // DATA BEING MODIFIED, COULD HAVE BEEN AN OBJECT BUT NOT GONNA FIX IT
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
  selectedPeriod,
  setSelectedPeriod,
}) {

  // DATE CONVERSIONS
  const hours = Array.from({ length: 12 }, (hour, index) => String(index + 1).padStart(2, '0'));

  const minutes = Array.from({ length: 60 }, (min, index) => String(index + 1).padStart(2, '0'));

  const periods = ['AM', 'PM'];

  const get24Hours = (hour, period) => {
    const hourNum = parseInt(hour, 10);
    if (period === 'AM') {
      return hourNum === 12 ? 0 : hourNum;
    } else {
      return hourNum === 12 ? 12 : hourNum + 12;
    }
  };

  return (
    <div className="date-dropdown">
    <h3 className='detail-text-white'>TIME</h3>
      <select
        value={selectedHour}
        onChange={(e) => setSelectedHour(e.target.value)}
        className="dropdown-item detail-text-dark">
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>

      <h3 className='detail-text-white'>:</h3>

      <select
        value={selectedMinute}
        onChange={(e) => setSelectedMinute(e.target.value)}
        className="dropdown-item detail-text-dark">
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>

      <select
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)}
        className="dropdown-item detail-text-dark">
        {periods.map((period) => (
          <option key={period} value={period}>
            {period}
          </option>
        ))}
      </select>
    </div>
  );
}
