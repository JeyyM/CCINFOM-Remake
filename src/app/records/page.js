'use client';

import { useState } from 'react';
import Link from 'next/link';
import ViewSet from '@/components/ViewSet';
import LineGraph from '@/components/LineGraph';
import PieChart from '@/components/PieGraph';
import BarChart from '@/components/BarGraph';
import MultiLineGraph from '@/components/MultiLineGraph';

export default function Records() {
  const data = [
    {
      id: 1,
      date: "JAN 01, 2024 08:00 AM",
      creation_date: "JAN 01, 2024 08:00 AM",
      updated_date: "JAN 01, 2024 08:00 AM",
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
      creation_date: "JAN 01, 2024 09:00 AM",
      updated_date: "JAN 02, 2024 09:30 AM",
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
      creation_date: "JAN 02, 2024 12:00 PM",
      updated_date: "JAN 03, 2024 10:00 AM",
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
      creation_date: "JAN 03, 2024 01:30 PM",
      updated_date: "JAN 04, 2024 01:00 PM",
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
      creation_date: "JAN 04, 2024 03:00 PM",
      updated_date: "JAN 05, 2024 03:30 PM",
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

  // SORTING DETAILS
  const [viewChoice, setViewChoice] = useState('scheduled');
  const [sortChoice, setSortChoice] = useState('appointment_date');
  const [orderChoice, setOrderChoice] = useState('desc');

  const handleSortChange = (e) => {
    setSortChoice(e.target.value);
  };

  const filteredSets = data
    .filter((set) =>
      set.status === viewChoice
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortChoice === 'appointment_date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortChoice === 'creation_date') {
        comparison = new Date(a.creation_date) - new Date(b.creation_date);
      } else if (sortChoice === 'updated_date') {
        comparison = new Date(a.updated_date) - new Date(b.updated_date);
      } else if (sortChoice === 'total') {
        comparison = a.payment.total - b.payment.total;
      } else if (sortChoice === 'last_name') {
        comparison = a.patient.name.localeCompare(b.patient.name);
      }

      return orderChoice === 'desc' ? -comparison : comparison;
    });


  var dates = [
    "1990-01-01",
    "1990-01-15",
    "1990-02-01",
    "1990-02-14",
    "1990-03-01",
    "1990-03-15",
    "1990-04-01",
    "1990-04-15",
    "1990-05-01",
    "1990-05-15",
  ]

  const sales = [
    500,
    600,
    900,
    100,
    1200,
    800,
    450,
    1100,
    750,
    950,
  ];

  const datasets = [
    {
      label: 'Product A Sales',
      data: [200, 300, 400, 350, 450, 500],
    },
    {
      label: 'Product B Sales',
      data: [150, 250, 350, 400, 300, 200],
    },
    {
      label: 'Product C Sales',
      data: [100, 200, 150, 300, 400, 450],
    }
  ];


  return (
    <div className='report-page background'>
      <div className='records-menu'>
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
              <option value="updated_date">Creation Date</option>
              <option value="total">Total Bill</option>
              <option value="last_name">Name</option>
            </select>
          </div>
        </div>

        <div className='graph-collection'>
          <div className='line-graph'>
            <LineGraph xaxis={dates} yaxis={sales} chart_label={"money over time"} xscale={"date"} yscale={"munny"}></LineGraph>
          </div>

          <div className='line-graph'>
            <MultiLineGraph
              xaxis={dates}
              datasets={datasets}
              chart_label="Sales Over Time"
            />
          </div>

          <div className='line-graph'>
            <PieChart
              labels={["Cupcake", "slop", "Cookies", "Fruits", "Drinks"]}
              data={[25, 40, 15, 10, 10]}
              chart_label="Fav Food"
            ></PieChart>
          </div>

          <div className='line-graph'>
            <BarChart
              labels={["Cupcake", "slop", "Cookies", "Fruits", "Drinks"]}
              data={[25, 40, 15, 10, 10]}
              chart_label="Fav Food"
            ></BarChart>
          </div>



        </div>

      </div>
    </div>
  );
}
