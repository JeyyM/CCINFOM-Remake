import React from 'react';
import { useState } from 'react';

// FOR DISPLAYING EMPLOYEE DATA
const EmployeeSet = ({ set, onEdit, onManage, type }) => {
  // NOTE type WHICH IS FOR SPECIFYING DISPLAYS

  // FOR THE DATES
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day.toString()}, ${year}`;
  };

  return (
    <div className="item-set">
      <div className="set-q1-b" style={{ width: "40%" }}>
        <div className="set-name text-medium-dark-bold"><div></div> {set.status == "Hired" ? <div className='green-circle'></div> : <div className='red-circle'></div>} {set.last_name.toUpperCase()}, {set.first_name.toUpperCase()}</div>

        <div className='set-detail-1'>
          <div className='set-detail-1-a text-medium-white'><span className='text-medium-white-bold'>SEX</span>&nbsp;&nbsp;{set.sex}</div>
          <div className='set-detail-1-b text-medium-white'><span className='text-medium-white-bold'>BIRTHDATE</span>&nbsp;&nbsp;{formatDate(set.date_of_birth)}</div>
        </div>
      </div>

      <div className="set-data">
        <div className="set-column-1" style={{ width: "45%" }}>
          <h2 className="text-small-white"><span className="text-small-white-bold">HIRED ON</span> {formatDate(set.date_hired)}</h2>
          <h2 className="text-small-white"><span className="text-small-white-bold">JOB</span> {set.job_name}</h2>
          <h2 className="text-small-white"><span className="text-small-white-bold">MONTHLY SALARY</span> {set.monthly_salary}</h2>
        </div>
        <div className="set-column-1" style={{ width: "45%" }}>
          <div className='set-contact'>
            <h2 className='text-small-white'>{set.email}</h2>
            <h2 className='text-small-white'>{set.phone_number}</h2>
          </div>
        </div>

        {type === "edit" && <div className="set-column-2" style={{ flexDirection: "row", gap: "2rem", width: "40%", paddingRight: "2rem" }}>
          <button className="neon-button-outline text-small-white">TEST HISTORY</button>
          <button onClick={(e) => { onEdit(e, set) }} style={{ backgroundColor: "transparent", border: "none" }}><div className='pencil-icon'></div></button>
        </div>}
      </div>
    </div>
  );
};

export default EmployeeSet;
