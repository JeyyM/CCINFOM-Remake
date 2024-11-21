import React from 'react';
import { useState } from 'react';

const EmployeeSet = ({ set, onEdit, onManage, type }) => {
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
        <div className="set-name text-medium-dark-bold">{set.last_name.toUpperCase()}, {set.first_name.toUpperCase()}</div>
        <div className='set-detail-1'>
          <div className='set-detail-1-a text-medium-white'><span className='text-medium-white-bold'>SEX</span>&nbsp;&nbsp;{set.sex}</div>
          <div className='set-detail-1-b text-medium-white'><span className='text-medium-white-bold'>BIRTHDATE</span>&nbsp;&nbsp;{formatDate(set.birthday)}</div>
        </div>
      </div>

      <div className="set-data">
        <div className="set-column-1" style={{ width: "40%" }}>
          <h2 className="text-small-white"><span className="text-small-white-bold">HIRED ON</span> {formatDate(set.hire_date)}</h2>
          <h2 className="text-small-white"><span className="text-small-white-bold">JOB</span> {set.job}</h2>
          <h2 className="text-small-white"><span className="text-small-white-bold">MONTHLY SALARY</span> {set.monthly_salary}</h2>
        </div>

        <div className="set-column-1" style={{ width: "25%" }}>
          {set.status ? <button className='dark-button text-small-light-bold'>HIRED</button> : <button className='red-button text-small-white-bold'>FIRED</button>}
          {set.manager_of && set.manager_of.length > 0 > 0 ? <button className='neon-button-outline text-small-white-bold' style={{ padding: "1rem 0" }}
          onClick={(e) => { onManage(e, set) }}>MANAGER</button> : <button className='neon-button-outline text-small-white-bold' style={{ padding: "1rem 0" }}
          onClick={(e) => { onManage(e, set) }}>STAFF</button>}

        </div>

        <div className="set-column-1" style={{ width: "45%" }}>
          <div className='set-contact'>
            <h2 className='text-small-white'>{set.email}</h2>
            <h2 className='text-small-white'>{set.phone}</h2>
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
