'use client';

import { useState } from 'react';
import Link from 'next/link';
import PatientSet from '@/components/PatientSet';
import PatientForm from '@/components/PatientForm';

export default function Patients() {
  const data = [
    {
      id: 1,
      last_name: "Smith",
      first_name: "John",
      birthday: "1990-01-15",
      phone: "09171234567",
      email: "john.smith@gmail.com",
      sex: "M",
      street: "123 Elm Street",
      city: "Makati",
      province: "Metro Manila",
    },
    {
      id: 2,
      last_name: "Doe",
      first_name: "Jane",
      birthday: "1985-03-22",
      phone: "09181234567",
      email: "jane.doe@gmail.com",
      sex: "F",
      street: "456 Pine Avenue",
      city: "Quezon City",
      province: "Metro Manila",
    },
    {
      id: 3,
      last_name: "Garcia",
      first_name: "Carlos",
      birthday: "1992-07-18",
      phone: "09201234567",
      email: "carlos.garcia@gmail.com",
      sex: "M",
      street: "789 Oak Lane",
      city: "Pasig",
      province: "Metro Manila",
    },
    {
      id: 4,
      last_name: "Reyes",
      first_name: "Maria",
      birthday: "1998-11-30",
      phone: "09192234567",
      email: "maria.reyes@gmail.com",
      sex: "F",
      street: "321 Maple Road",
      city: "Cebu City",
      province: "Cebu",
    },
    {
      id: 5,
      last_name: "Tan",
      first_name: "Alexander",
      birthday: "1980-06-12",
      phone: "09193334567",
      email: "alex.tan@gmail.com",
      sex: "M",
      street: "654 Birch Boulevard",
      city: "Davao City",
      province: "Davao del Sur",
    },
    {
      id: 6,
      last_name: "Santos",
      first_name: "Angela",
      birthday: "1995-04-25",
      phone: "09194434567",
      email: "angela.santos@gmail.com",
      sex: "F",
      street: "987 Cedar Court",
      city: "Taguig",
      province: "Metro Manila",
    },
    {
      id: 7,
      last_name: "Luna",
      first_name: "Roberto",
      birthday: "1983-09-05",
      phone: "09195534567",
      email: "roberto.luna@gmail.com",
      sex: "M",
      street: "111 Willow Drive",
      city: "Baguio City",
      province: "Benguet",
    },
    {
      id: 8,
      last_name: "Villanueva",
      first_name: "Sophia",
      birthday: "1999-02-14",
      phone: "09196634567",
      email: "sophia.villanueva@gmail.com",
      sex: "F",
      street: "222 Spruce Avenue",
      city: "Iloilo City",
      province: "Iloilo",
    },
    {
      id: 9,
      last_name: "Cruz",
      first_name: "Miguel",
      birthday: "1993-12-10",
      phone: "09197734567",
      email: "miguel.cruz@gmail.com",
      sex: "M",
      street: "333 Aspen Street",
      city: "Zamboanga City",
      province: "Zamboanga del Sur",
    },
    {
      id: 10,
      last_name: "Fernandez",
      first_name: "Isabella",
      birthday: "2000-08-08",
      phone: "09198834567",
      email: "isabella.fernandez@gmail.com",
      sex: "F",
      street: "444 Palm Road",
      city: "Bacolod City",
      province: "Negros Occidental",
    },
  ];

  // OVERARCHING DATA
  const [collectionData, setCollectionData] = useState(data);

  // PATIENT DETAILS
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSave = (patient) => {
    if (patient.id) {
      // EXISTING
      setCollectionData((prev) =>
        prev.map((p) => (p.id === patient.id ? patient : p))
      );
    } else {
      // NEW
      // NOTE, I PUT THIS HERE FOR THE INCREASE OF IDS, THIS MIGHT HAVE TO BE REMOVED SINCE 
      // WE CAN USE AUTO ITERATION IN SQL
      const newId = Math.max(...collectionData.map((p) => p.id)) + 1;
      setCollectionData((prev) => [...prev, { ...patient, id: newId }]);
    }
    setSelectedPatient(null);
  };

  // SORTERS AND SEARCHER
  const [sortChoice, setSortChoice] = useState('id');
  const [orderChoice, setOrderChoice] = useState('desc');

  const handleSortChange = (e) => {
    setSortChoice(e.target.value);
  };

  const [searchValue, setSearchValue] = useState('');

  // FILTERS AND SORTING EXECUTION
  const filteredSets = collectionData
    .filter((set) =>
      `${set.first_name} ${set.last_name}`
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortChoice === 'id') {
        comparison = a.id - b.id;
      } else if (sortChoice === 'last_name') {
        comparison = a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name);
      } else if (sortChoice === 'birthday') {
        comparison = new Date(a.birthday) - new Date(b.birthday);
      } else if (sortChoice === 'city') {
        comparison = a.city.localeCompare(b.city);
      } else if (sortChoice === 'sex') {
        comparison = a.sex.localeCompare(b.sex);
      }

      return orderChoice === 'desc' ? -comparison : comparison;
    });

  return (
    <div className='view-appointments-page background'>

      {selectedPatient && (
        <PatientForm
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          onClose={() => setSelectedPatient(null)}
          handleSave={handleSave}
        />
      )}

      <div className='view-appointments-menu'>
        <div className='view-nav' style={{ justifyContent: "space-between" }}>

          <div className='search-pair'>
            <h2 className='text-medium-white-bold'>SEARCH</h2>
            <input className='search-bar detail-text-dark' placeholder='Input Patient Name' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}></input>

          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
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
                <option value="id">Newest</option>
                <option value="last_name">Name</option>
                <option value="birthday">Age</option>
                <option value="sex">Sex</option>
                <option value="city">City</option>
              </select>
            </div>

            <button className='medium-button-1 detail-text-dark' onClick={() => setSelectedPatient({})}>ADD PATIENT</button>

          </div>
        </div>

        <div className="set-collection">
          {filteredSets.map((set, index) => (
            <PatientSet key={index} set={set} onEdit={() => setSelectedPatient(set)} type="edit" />
          ))}
        </div>

      </div>
    </div>
  );
}
