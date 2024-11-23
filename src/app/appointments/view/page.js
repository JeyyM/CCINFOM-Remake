'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ViewSet from '@/components/ViewSet';
import EditTestForm from '@/components/EditTestForm';
// import AppointmentForm from '@/components/AppointmentForm';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState({});
  const [editing, setEditing] = useState(false);
  const [where, setStatusFilter] = useState('');
  
  const fetchData = async () => {
    const table = "appointment";
    const columns =
    "appointment.appointment_id, " +
    "appointment.appointment_date AS date, " +
    "appointment.created_at AS creation_date, " +
    "appointment.updated_at AS updated_date, " +

    "CONCAT(patient_person.last_name, ', ', patient_person.first_name) AS patient_name, " +
    "patient_person.email AS patient_email, " +
    "patient_person.phone_number AS patient_phone, " +
    "patient_person.sex AS patient_sex, " +
    "patient_person.date_of_birth AS patient_birthday, " +

    "patient_person.street_name AS street_name, " +
    "patient_person.city_name AS city_name, " +
    "patient_person.province_name AS province_name, " +

    "CONCAT(staff_person.last_name, ', ', staff_person.first_name) AS staff_name, " +
    "bill.total_bill AS total, " +
    "(bill.total_bill - bill.total_paid) AS due, " +
    "bill.total_paid AS paid, " +
    "LOWER(appointment.status) AS status";

    // const columns = "appointment.appointment_id";

    console.log("COLUMNS HERE",columns);


    const joins = [
      { type: "INNER", table: "patient", on: "appointment.patient_id = patient.person_id" },
      { type: "INNER", table: "person AS patient_person", on: "patient.person_id = patient_person.person_id" },
      { type: "INNER", table: "staff", on: "appointment.staff_id = staff.person_id" },
      { type: "INNER", table: "person AS staff_person", on: "staff.person_id = staff_person.person_id" },
      { type: "INNER", table: "bill", on: "appointment.appointment_id = bill.appointment_id" },
    ];

    try {
      const response = await fetch(
        `/api/getData?type=query&table=${encodeURIComponent(table)}&columns=${encodeURIComponent(columns)}&where=${encodeURIComponent(where)}&joins=${encodeURIComponent(JSON.stringify(joins))}`
      );

      if (!response.ok) throw new Error("Failed to fetch appointment data");

      const result = await response.json();

      setAppointments(result);

    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  useEffect(() => {  
    fetchData();
  }, []);

  // SORTING DETAILS
  const [viewChoice, setViewChoice] = useState('scheduled');
  const [sortChoice, setSortChoice] = useState('appointment_date');
  const [orderChoice, setOrderChoice] = useState('desc');

  const handleSortChange = (e) => {
    setSortChoice(e.target.value);
  };

  const filteredSets = appointments
  .filter((set) =>
    set.status === viewChoice
  )
  .sort((a, b) => {
    let comparison = 0;

    if (sortChoice === 'date') {
      const dateA = a.date ? new Date(a.date).toISOString().split('T')[0] : '';
      const dateB = b.date ? new Date(b.date).toISOString().split('T')[0] : '';

      comparison = dateA.localeCompare(dateB);

    } else if (sortChoice === 'creation_date') {
      const dateA = a.creation_date ? new Date(a.creation_date).toISOString().split('T')[0] : '';
      const dateB = b.creation_date ? new Date(b.creation_date).toISOString().split('T')[0] : '';

      comparison = dateA.localeCompare(dateB);
    } else if (sortChoice === 'updated_date') {
      const dateA = a.updated_date ? new Date(a.updated_date).toISOString().split('T')[0] : '';
      const dateB = b.updated_date ? new Date(b.updated_date).toISOString().split('T')[0] : '';

      comparison = dateA.localeCompare(dateB);
    } else if (sortChoice === 'total') {
      comparison = a.total - b.total;
    } else if (sortChoice === 'patient_name') {
      comparison = a.patient_name.localeCompare(b.patient_name);
    }

    return orderChoice === 'desc' ? -comparison : comparison;
  });


  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeout);
  }, [editing]);

  return (
    <div className='view-appointments-page background'>
      {editing && (
        <EditTestForm
          selectedTest={selectedAppointment}
          onClose={() => { setEditing(false) }}
        />
      )}

      <div className='view-appointments-menu'>
        <div className='view-nav'>

          <div className='view-choices view-choice-name'>
            <button className='text-medium-white view-choice-name'
                    style={{ fontWeight: viewChoice === 'scheduled' ? "600" : "400" }}
                    onClick={() => {
                        if (viewChoice !== 'scheduled') {
                          setViewChoice('scheduled');
                          setStatusFilter("status = 'scheduled'");
                          return;
                        }
                        setViewChoice("");
                        setStatusFilter("");
                    }}
            >SCHEDULED</button>
            <div className='view-divider'></div>
            <button className='text-medium-white view-choice-name'
                    style={{ fontWeight: viewChoice === 'completed' ? "600" : "400" }}
                    onClick={() => {
                      if (viewChoice !== 'completed') {
                        setViewChoice('completed');
                        setStatusFilter("status = 'completed'");
                        return;
                      }
                      setViewChoice("");
                      setStatusFilter("");
                    }}
            >COMPLETED</button>
            <div className='view-divider'></div>
            <button className='text-medium-white view-choice-name'
                    style={{ fontWeight: viewChoice === 'cancelled' ? "600" : "400" }}
                    onClick={() => {
                      if (viewChoice !== 'cancelled') {
                        setViewChoice('cancelled');
                        setStatusFilter("status = 'cancelled'");
                        return;
                      }
                      setViewChoice("");
                      setStatusFilter("");
                    }}
            >CANCELLED</button>
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
              <option value="date">Schedule Date</option>
              <option value="creation_date">Creation Date</option>
              <option value="total">Total Bill</option>
              <option value="patient_name">Name</option>
            </select>
          </div>
        </div>

        <div className="set-collection">
          {filteredSets.map((set, index) => (
            <ViewSet key={index} set={set} 
            onEdit={() => {
              setSelectedAppointment(set);
              setEditing(true);
            }}/>
          ))}
        </div>

      </div>
    </div>
  );
}

//