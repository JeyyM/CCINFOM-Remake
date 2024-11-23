'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ViewSet from '@/components/ViewSet';

export default function Appointments() {
  const [data, setData] = useState([]);
  const [viewChoice, setViewChoice] = useState('scheduled');
  const [sortChoice, setSortChoice] = useState('appointment_date');
  const [orderChoice, setOrderChoice] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const orderBy = `${sortChoice} ${orderChoice === 'desc' ? 'DESC' : 'ASC'}`;
      const whereClause = `status = '${viewChoice}'`;

      try {
        const response = await fetch(
          `/api/getData?type=query&table=appointment&columns=appointment_id AS id, appointment_date AS date, created_at AS creation_date, updated_at AS updated_date, status, 
            (SELECT CONCAT(last_name, ', ', first_name) FROM person WHERE person_id = appointment.patient_id) AS patient_name,
            (SELECT email FROM person WHERE person_id = appointment.patient_id) AS patient_email,
            (SELECT CONCAT(last_name, ', ', first_name) FROM person WHERE person_id = appointment.staff_id) AS staff_name,
            (SELECT total FROM bill WHERE appointment_id = appointment.appointment_id) AS total,
            (SELECT total - paid FROM bill WHERE appointment_id = appointment.appointment_id) AS due,
            (SELECT paid FROM bill WHERE appointment_id = appointment.appointment_id) AS paid
          &where=${encodeURIComponent(whereClause)}
          &orderBy=${encodeURIComponent(orderBy)}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        const formattedData = result.map((item) => ({
          id: item.id,
          date: item.date,
          creation_date: item.creation_date,
          updated_date: item.updated_date,
          patient: { name: item.patient_name, email: item.patient_email },
          staff: { name: item.staff_name },
          payment: { total: item.total, due: item.due, paid: item.paid },
          status: item.status.toLowerCase(),
        }));

        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewChoice, sortChoice, orderChoice]);

  const handleSortChange = (e) => {
    setSortChoice(e.target.value);
  };

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
              <option value="updated_date">Creation Date</option>
              <option value="total">Total Bill</option>
              <option value="last_name">Name</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="set-collection">
            {data.map((set, index) => (
              <ViewSet key={index} set={set} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
