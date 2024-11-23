'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PatientSet from '@/components/PatientSet';
import PatientForm from '@/components/PatientForm';

export default function Patients() {
  const [collectionData, setCollectionData] = useState([]);
  const [editing, setEditing] = useState(false);

  const fetchPatientinfo = async () => {
    const tableName = "person";
    const joins = JSON.stringify([{ type: "INNER" ,table: "patient", on: "patient.person_id = person.person_id" }]);
    try {
        const response = await fetch(
          `/api/getData?type=query&table=${(tableName)}&joins=${(joins)}`
        );
        const data = await response.json();
        //console.log("API Response Data:", data);
        if (response.ok) {
            //console.log("API Response Data:", data);
            return data
        } else {
            throw new Error('Failed to fetch patient information');
        }
    } catch (error) {
        console.error("Error fetching patient information:", error.message);
        throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
        try {
            // Wait for data to be fetched from the server
            const fetchedData = await fetchPatientinfo();
            // Update the collectionData state with the fetched data
            setCollectionData(fetchedData);
            console.log("Data loaded successfully");
        } catch (error) {
            console.error("Failed to load patient data:", error);
        }
    };

    // Adding a delay using setTimeout before executing the loadData function
    const timeout = setTimeout(() => {
        loadData();
    }, 300);

    // Cleanup function to clear the timeout when the component unmounts or dependencies change
    return () => clearTimeout(timeout);
  }, [editing]);



  // OVERARCHING DATA
  //const [collectionData, setCollectionData] = useState(data);

  // PATIENT DETAILS
  const [selectedPatient, setSelectedPatient] = useState(null);

  // SORTERS AND SEARCHER
  const [sortChoice, setSortChoice] = useState('person_id');
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

      if (sortChoice === 'person_id') {
        comparison = a.person_id - b.person_id;
      } else if (sortChoice === 'last_name') {
        comparison = a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name);
      } else if (sortChoice === 'birthday') {
        comparison = new Date(a.birthday) - new Date(b.birthday);
      } else if (sortChoice === 'city') {
        comparison = a.city_name.localeCompare(b.city_name);
      } else if (sortChoice === 'sex') {
        comparison = a.sex.localeCompare(b.sex);
      }

      return orderChoice === 'desc' ? -comparison : comparison;
    });

    console.log(filteredSets);

  return (
    <div className='view-appointments-page background'>

      {editing && (
        <PatientForm
          selectedPatient={selectedPatient}
          onClose={() => { setEditing(false) }}
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
                <option value="person_id">Newest</option>
                <option value="last_name">Name</option>
                <option value="birthday">Age</option>
                <option value="sex">Sex</option>
                <option value="city">City</option>
              </select>
            </div>

            <button className='medium-button-1 detail-text-dark' onClick={() => { setSelectedPatient({}); setEditing(!editing) }}>ADD PATIENT</button>

          </div>
        </div>

        <div className="set-collection">
          {filteredSets.map((set, index) => (
            <PatientSet key={index} set={set} onEdit={() => {
              setSelectedPatient({ ...set, person_id: set.person_id }); 
              setEditing(true);}} type="edit" />
          ))}
        </div>

      </div>
    </div>
  );
}
