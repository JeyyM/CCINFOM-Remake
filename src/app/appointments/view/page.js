'use client';

import { useState } from 'react';
import Link from 'next/link';
import ViewSet from '@/app/components/ViewSet';

export default function Appointments() {
  const [viewChoice, setViewChoice] = useState('scheduled');
  const [sortChoice, setSortChoice] = useState('appointment_date');
  const [orderChoice, setOrderChoice] = useState('desc');


  const handleSortChange = (e) => {
    setSortChoice(e.target.value);
  };

  const setCollectionData = [
    {
      id: 1,
      date: "JAN 01, 2024 08:00 AM",
      createdDate: "JAN 01, 2024 08:00 AM",
      updatedDate: "JAN 01, 2024 08:00 AM",
      patient: {
        name: "Doe, John",
        email: "johndoe@gmail.com",
      },
      staff: {
        name: "Smith, Alice",
      },
      payment: {
        total: 1000,
        due: 1000,
        paid: 0,
      },
      status: "scheduled",
    },
    {
      id: 2,
      date: "JAN 02, 2024 10:30 AM",
      createdDate: "JAN 01, 2024 09:00 AM",
      updatedDate: "JAN 02, 2024 09:30 AM",
      patient: {
        name: "Johnson, Emily",
        email: "emilyjohnson@gmail.com",
      },
      staff: {
        name: "Brown, Mike",
      },
      payment: {
        total: 1500,
        due: 1500,
        paid: 0,
      },
      status: "cancelled",
    },
    {
      id: 3,
      date: "JAN 03, 2024 11:00 AM",
      createdDate: "JAN 02, 2024 12:00 PM",
      updatedDate: "JAN 03, 2024 10:00 AM",
      patient: {
        name: "Taylor, Samantha",
        email: "samanthataylor@gmail.com",
      },
      staff: {
        name: "Wilson, Mark",
      },
      payment: {
        total: 2000,
        due: 1000,
        paid: 1000,
      },
      status: "completed",
    },
    {
      id: 4,
      date: "JAN 04, 2024 02:00 PM",
      createdDate: "JAN 03, 2024 01:30 PM",
      updatedDate: "JAN 04, 2024 01:00 PM",
      patient: {
        name: "Clark, Sarah",
        email: "sarahclark@gmail.com",
      },
      staff: {
        name: "Evans, David",
      },
      payment: {
        total: 1200,
        due: 600,
        paid: 600,
      },
      status: "completed",
    },
    {
      id: 5,
      date: "JAN 05, 2024 04:00 PM",
      createdDate: "JAN 04, 2024 03:00 PM",
      updatedDate: "JAN 05, 2024 03:30 PM",
      patient: {
        name: "Morris, Kevin",
        email: "kevinmorris@gmail.com",
      },
      staff: {
        name: "Walker, Jessica",
      },
      payment: {
        total: 1800,
        due: 1800,
        paid: 0,
      },
      status: "scheduled",
    },
  ];

  const filteredSets = setCollectionData.filter((set) => set.status === viewChoice);

  return (
    <div className='view-appointments-page background'>
      <div className='view-appointments-menu'>
        <div className='view-nav'>

          <div className='view-choices view-choice-name'>
            <button className='text-medium-white view-choice-name'
              style={{ fontWeight: viewChoice === 'scheduled' ? "600" : "400" }}
              onClick={() => setViewChoice('scheduled')}>SCHEDULED</button>
            <div className='view-divider'></div>
            <button className='text-medium-white view-choice-name'
              style={{ fontWeight: viewChoice === 'completed' ? "600" : "400" }}
              onClick={() => setViewChoice('completed')}>COMPLETED</button>
            <div className='view-divider'></div>
            <button className='text-medium-white view-choice-name'
              style={{ fontWeight: viewChoice === 'cancelled' ? "600" : "400" }}
              onClick={() => setViewChoice('cancelled')}>CANCELLED</button>
          </div>

          <div className='view-sort-by'>
            <div className='view-order'>
              <h3 className='text-medium-white-bold' style={{ marginRight: "auto", fontSize: "1.5rem" }}>SORT BY</h3>
              <button className='order-choice text-medium-dark-bold'
                onClick={() => setOrderChoice(orderChoice == "desc" ? '' : "desc")}
                style={{ fontSize: "1.5rem" }}>
                {orderChoice == "desc" ? "DESCENDING" : "ASCENDING"}</button>
            </div>

            <select
              value={sortChoice}
              onChange={handleSortChange}
              className="dropdown-item-2 detail-text-dark">
              <option value="appointment_date">Schedule Date</option>
              <option value="creation_date">Creation Date</option>
              <option value="total_bill">Total Bill</option>
              <option value="last_name">Name</option>
            </select>
          </div>
        </div>

        <div className="set-collection">
        {filteredSets.map((set, index) => (
          <ViewSet key={index} set={set} />
        ))}
      </div>

      </div>
    </div>
  );
}
