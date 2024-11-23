'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TestForm from '@/components/TestForm';
import TestItem from '@/components/TestItem';

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

  console.log("TABLES", tables);
  console.log("TEST TYPES", testTypes);

  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({});
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

  const handleEdit = async ({ tableKey, formData, primaryLabel, primaryInput }) => {
    const res = await fetch('/api/getData', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tableName: tableKey,
        formData,
        primaryKey: primaryLabel,
        primaryValue: primaryInput,
      }),
    });
  
    if (!res.ok) {
      console.log("FAILED");
      // throw new Error('Failed to update data');
    }
    const response = await res.json();
  };
  
  const handleDelete = async ({ tableName, primaryKey, primaryValue }) => {
    const res = await fetch('/api/getData', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tableName,
        primaryKey,
        primaryValue,
      }),
    });
  
    if (!res.ok) {
      throw new Error('Failed to delete data');
    }
    const response = await res.json();
    console.log('Delete Response:', response);
  };


  // TRIGGERS THE TABLE CHECK UPON START AND OPENING AND CLOSING THE POP-UP
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTables();
      fetchContent();  
    }, 300);
    return () => clearTimeout(timeout);
  }, [adding]);
  
  console.log(tables);
  console.log(testTypes);

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

            console.log("TABLE NAME", tableName);

            const matchingTest = testTypes.find(test => {
              console.log("TEST NAME", test.test_name);
              return test.test_name.toLowerCase() == tableName.toLowerCase();
            });

            return <TestItem key={index} matchingTest={matchingTest} columns={columns} handleEdit={handleEdit} handleDelete={handleDelete}></TestItem>
          })}
        </div>


      </div>
    </div>
  );
}
