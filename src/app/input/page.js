'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InputPage() {
  // Form states
  const [tableName, setTableName] = useState('');

  // GETS THE COLUMNS AND THEIR PROPERTIES
  const [columns, setColumns] = useState([]);

  // FOR THE FORM VALUES
  const [formData, setFormData] = useState({});

  const handleChange = (e, columnName) => {
    setFormData({ ...formData, [columnName]: e.target.value });
  };

  // ERROR MESSAGES
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // TO GET COLUMN PROPERTIES
  async function fetchColumns(tableName) {
    try {
      const res = await fetch(`/api/getData?type=columns&table=${tableName}`);
      if (!res.ok) {
        throw new Error('Failed to fetch columns');
      }
      return res.json();
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch columns');
      return [];
    }
  }


  const handleFetch = async () => {
    try {
      setError('');
      setSuccessMessage('');
      
      const result = await fetchColumns(tableName);

      // to filter out auto_increment types so they don't get touched
      const filteredColumns = result.filter(col => col.EXTRA !== 'auto_increment');
      setColumns(filteredColumns);

      // to reset the fields
      setFormData({});
    } catch (err) {
      setError(err.message);
    }
  };

  // COMPLETES UPDATING
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/getData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName, formData })
      });

      const response = await res.json();
      if (res.ok) {
        setSuccessMessage(response.message);
        setFormData({});
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to insert data');
    }
  };

  return (
    <div className='vertical'>
      <h1>Insert Data into Table</h1>
      <Link href="..">Back</Link>

      <input
        type="text"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        placeholder="Enter table name"
      />
      <button onClick={handleFetch}>Fetch Fields</button>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {columns.length > 0 && (
        <form onSubmit={handleSubmit}>
          {columns.map((column, index) => (
            <div key={index}>
              <label>{column.COLUMN_NAME}</label>
              <input
                type="text"
                value={formData[column.COLUMN_NAME] || ''}
                onChange={(e) => handleChange(e, column.COLUMN_NAME)}
                placeholder={`Enter value for ${column.COLUMN_NAME}`}
              />
            </div>
          ))}
          <button type="submit">Insert Data</button>
        </form>
      )}
    </div>
  );
}
