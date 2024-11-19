import React from 'react';

const ViewSet = ({ set }) => {
  return (
    <div className="item-set">
      <div className="set-q1">
        <div className="set-date text-medium-dark-bold">{set.date}</div>
        <h2 className="text-small-dark">
          <span className="text-small-dark-bold">CREATED: </span>
          {set.createdDate}
        </h2>
        <h2 className="text-small-dark">
          <span className="text-small-dark-bold">UPDATED: </span>
          {set.updatedDate}
        </h2>
      </div>

      <div className="set-data">
        <div className="set-column-1">
          <div className="set-pair">
            <h2 className="text-small-white-bold">PATIENT</h2>
            <div className="pair-col">
              <h3 className="text-small-white">{set.patient.name}</h3>
              <h3 className="text-small-white">{set.patient.email}</h3>
            </div>
          </div>

          <div className="set-pair">
            <h2 className="text-small-white-bold">STAFF</h2>
            <div className="pair-col">
              <h3 className="text-small-white">{set.staff.name}</h3>
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
              <h3 className="text-small-white">{set.payment.total}</h3>
              <h3 className="text-small-white">{set.payment.due}</h3>
              <input
                className="input-small text-small-dark"
                value={set.payment.paid}
                readOnly
                placeholder="Paid Value"
              />
            </div>
          </div>
        </div>

        {set.status == "scheduled" ? <div className="set-column-2">
          <button className="neon-button text-small-dark">COMPLETE</button>
          <button className="neon-button-outline text-small-white">CANCEL</button>
        </div> : 
        
        set.status == "completed" ? <div className="set-column-2">
          <button className="neon-button-outline text-small-white">VIEW TEST RESULTS</button>
        </div> : 

         <div className="set-column-2">
            <button className="neon-button-outline text-small-white">VIEW FILE (??)</button>
        </div>
        }
      </div>
    </div>
  );
};

export default ViewSet;
