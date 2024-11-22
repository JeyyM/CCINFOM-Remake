'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TestForm from '@/app/components/TestForm';

// FOR ADDING NEW TESTS
export default function Employees() {
  // TO IGNORE NON-TEST TABLES
  const toFilter = [
    "appointment",
    "appointment_result",
    "bill",
    "patient",
    "person",
    "person_address",
    "ref_job",
    "ref_test_type",
    "staff"
  ]

  // SETS UP THE LIST OF TABLES AND MAKES THEM INTO OBJECTS
  const [tables, setTables] = useState({});
  const [error, setError] = useState("");

  // FOR THE POP-UP
  const [adding, setAdding] = useState(false);

  // USES THE API CALL TO GET THE COLUMN INFORMATION OF A TABLE
  const fetchColumns = async (tableName) => {
    try {
      const res = await fetch(`/api/getData?type=columns&table=${tableName}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch columns for ${tableName}`);
      }
      return res.json();
    } catch (err) {
      console.error(`Fetch error for ${tableName}:`, err);
      setError(`Failed to fetch columns for ${tableName}`);
      return [];
    }
  };

  // USES THE API CALL TO GET THE LIST OF ALL TABLES
  const fetchTables = async () => {
    try {
      const response = await fetch('/api/getData?type=tables');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      const filteredTables = data.filter(table => !toFilter.includes(table));

      const dataColumns = {};
      for (const table of filteredTables) {
        const columns = await fetchColumns(table);
        dataColumns[table] = columns;
      }
      setTables(dataColumns);
    } catch (err) {
      setError(err.message);
    }
  };

  // TRIGGERS THE TABLE CHECK UPON START AND OPENING AND CLOSING THE POP-UP
  useEffect(() => {
    fetchTables();
  }, [adding]);

  console.log(tables);

  return (
    <div className='view-appointments-page background'>

      {adding && (
        <TestForm
          onClose={() => setAdding(false)}
        />
      )}

      <div className='view-appointments-menu'>
        <div className='view-nav' style={{ justifyContent: "space-between" }}>

          <div style={{ marginLeft: "auto" }}>
            <button className='medium-button-1 detail-text-dark' onClick={() => { setAdding(!adding) }}>ADD TEST</button>
          </div>
        </div>

        <div className="selection-grid">
          {Object.entries(tables).map(([tableName, columns], index) => (
            <div key={index} className="test-item">
                <div className="set-name text-medium-dark-bold">{tableName} <span className='text-medium-dark' style={{marginLeft:"auto"}}>Cost: </span> 
                <input className='form-input text-small-dark' style={{width:"25%", marginRight:"0"}}></input>
                <button className='dark-button text-small-light' style={{width:"min-content"}}>Modify</button></div>

                <div className='test-fields'>
                {columns.map((column, idx) => (
                  <h3 key={idx} className="text-small-white"><span className="text-small-white-bold">{column.COLUMN_NAME}:</span> ({column.COLUMN_TYPE})</h3>
                ))}
                </div>
        </div>
          ))}
        </div>


      </div>
    </div>
  );
}
