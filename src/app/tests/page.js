'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TestForm from '@/components/TestForm';

// FOR ADDING NEW TESTS
export default function Tests() {
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
    "staff",
    "junction_table"
  ]

  // SETS UP THE LIST OF TABLES AND MAKES THEM INTO OBJECTS
  const [tables, setTables] = useState({});
  const [testTypes, setTestTypes] = useState([]);

  const [chosenTest, setChosenTest] = useState({});

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
      // console.error(`Fetch error for ${tableName}:`, err);
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

  async function fetchContent() {
    const type = "query"
    const destination = "ref_test_type";

    const res = await fetch(
      `/api/getData?type=${type}&table=${destination}`
    );
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    setTestTypes(data);
  }

  const handleEdit = async () => {
    try {

      console.log("chosenTest", chosenTest);

      // const res = await fetch('/api/getData', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     tableName: "ref_test_type",
      //     formData: chosenTest,
      //     primaryKey: "test_name",
      //     primaryValue: ""
      //   })
      // });

      // const response = await res.json();

      // if (!res.ok) {
      //   // setMessage(response.error);
      // } else {
      //   // setMessage(response.message);
      //   // onClose();
      // }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };


  // TRIGGERS THE TABLE CHECK UPON START AND OPENING AND CLOSING THE POP-UP
  useEffect(() => {
    fetchTables();
    fetchContent();

  }, [adding, chosenTest]);

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
          {Object.entries(tables).map(([tableName, columns], index) => {
            const matchingTest = testTypes.find(test => {
              return test.test_name == tableName.toUpperCase()
            });

            return <div key={index} className="test-item">
              <div className="set-name text-medium-dark-bold">{matchingTest.test_name} <span className='text-medium-dark' style={{ marginLeft: "auto" }}>Cost: </span>
                <input className='form-input text-small-dark' value={matchingTest.test_price} onChange={(e) => {
                  setTestTypes(prevTestTypes =>
                    prevTestTypes.map(test =>
                      test.test_name === matchingTest.test_name
                        ? { ...test, test_price: e.target.value }
                        : test
                    )
                  );
                }}

                  style={{ width: "25%", marginRight: "0" }}></input>
              </div>

              <div className='test-fields'>
                {columns.map((column, idx) => (
                  <h3 key={idx} className="text-small-white"><span className="text-small-white-bold">{column.COLUMN_NAME}:</span> ({column.COLUMN_TYPE})</h3>
                ))}
              </div>
            </div>
          })}
        </div>


      </div>
    </div>
  );
}
