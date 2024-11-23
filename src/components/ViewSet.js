import React from 'react';

// THE DISPLAY OF APPOINTMENT DETAILS
const ViewSet = ({ set, onEdit }) => {
  console.log(set);

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
      <div className="set-q1">
        <div className="set-date text-medium-dark-bold" style={{textAlign:"left"}}>{formatDate(set.date)}</div>
        <h2 className="text-small-dark">
          <span className="text-small-dark-bold">CREATED: </span>
          {formatDate(set.creation_date)}
        </h2>
        <h2 className="text-small-dark">
          <span className="text-small-dark-bold">UPDATED: </span>
          {formatDate(set.updated_date)}
        </h2>
      </div>

      <div className="set-data">
        <div className="set-column-1">
          <div className="set-pair">
            <h2 className="text-small-white-bold">PATIENT</h2>
            <div className="pair-col">
              <h3 className="text-small-white">{set.patient_name}</h3>
              {/* <h3 className="text-small-white">{set.patient.email}</h3> */}
            </div>
          </div>

          <div className="set-pair">
            <h2 className="text-small-white-bold">STAFF</h2>
            <div className="pair-col">
              <h3 className="text-small-white">{set.staff_name}</h3>
            </div>
          </div>
        </div>

        <div className="set-column-1">
          <div className="set-pair">
            <div className="pair-col">
              <h3 className="text-small-white-bold">TOTAL PAYMENT</h3>
              <h3 className="text-small-white-bold">AMOUNT DUE</h3>
              <h3 className="text-small-white-bold">AMOUNT PAID</h3>
            </div>

            <div className="pair-col">
              <h3 className="text-small-white">{set.total}</h3>
              <h3 className="text-small-white">{set.due}</h3>
              <input
                className="input-small text-small-dark"
                value={set.paid}
                readOnly
                placeholder="Paid Value"
              />
            </div>
          </div>
        </div>

        {set.status == "scheduled" ? <div className="set-column-2">
          <button className="neon-button text-small-dark-bold" onClick={(e) => { onEdit(e, set) }}>Fill Out Appointment</button>
          {/* <button className="neon-button-outline text-small-white">CANCEL</button> */}
        </div> : 
        
        set.status == "completed" ? <div className="set-column-2">
        <button className="neon-button text-small-dark-bold" onClick={(e) => { onEdit(e, set) }}>Edit Appointment</button>
        </div> : 

         <div className="set-column-2">
         <button className="neon-button text-small-dark-bold" onClick={(e) => { onEdit(e, set) }}>Edit Appointment</button>
        </div>
        }
      </div>
    </div>
  );
};

export default ViewSet;
