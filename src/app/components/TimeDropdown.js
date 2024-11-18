import React, { useState } from 'react';

export default function TimeDropdown({
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
  selectedPeriod,
  setSelectedPeriod,
}) {
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

      <div>
        {/* <h1>
          Curr Time: {get24Hours(selectedHour, selectedPeriod)}:{selectedMinute.padStart(2, '0')}
        </h1> */}
        
      </div>
    </div>
  );
}
