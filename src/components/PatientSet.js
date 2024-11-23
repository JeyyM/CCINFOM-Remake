import React from 'react';

// FOR DISPLAYING PATIENT DATA
const PatientSet = ({ set, onEdit, type }) => {
  // DATE FORMATTERS
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
// debugging
// console.log("PatientSet - Field Values:", {
//   last_name: set.last_name,
//   first_name: set.first_name,
//   sex: set.sex,
//   birthday: set.birthday,
//   phone: set.phone,
//   email: set.email,
//   street: set.street,
//   city: set.city,
//   province: set.province,
// });
  return (
    <div className="item-set">
      <div className="set-q1-b">
        <div className="set-name text-medium-dark-bold">{set.last_name.toUpperCase()}, {set.first_name.toUpperCase()}</div>
        <div className='set-detail-1'>
          <div className='set-detail-1-a text-medium-white'><span className='text-medium-white-bold'>SEX</span>&nbsp;&nbsp;{set.sex}</div>
          <div className='set-detail-1-b text-medium-white'><span className='text-medium-white-bold'>BIRTHDATE</span>&nbsp;&nbsp;{formatDate(set.date_of_birth)}</div>
        </div>
      </div>

      <div className="set-data" style={{height:"100%"}}>
        <div className="set-column-1" style={{width:"60%"}}>
            <h2 className="text-small-white-bold">ADDRESS</h2>
            <h3 className="text-small-white">{set.street_name}, {set.city_name}, {set.province_name}</h3>
        </div>

        <div className="set-column-1" style={{width:"60%"}}>
          <div className='set-contact'>
              <h2 className='text-small-white'>{set.email}</h2>
              <h2 className='text-small-white'>{set.phone_number}</h2>
          </div>
        </div>

        {type === "edit" && <div className="set-column-2" style={{flexDirection:"row", gap:"1rem"}}>
            <button className="neon-button-outline text-small-white">APPOINTMENT HISTORY</button>
            <button onClick={(e) => {onEdit(e, set)}} style={{backgroundColor:"transparent", border:"none"}}><div className='pencil-icon'></div></button>
        </div>}
      </div>
    </div>
  );
};

export default PatientSet;
