'use client';

import { useState } from 'react';

export default function InputPage() {
  const [tableName, setTableName] = useState('');
  const [formData, setFormData] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleAddField = () => {
    setFormData([
      ...formData,
      { name: '', nullable: false, dataType: 'Varchar(50)', isPrimaryKey: false, autoIncrement: false },
    ]);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = formData.map((field, i) =>
      i === index ? { ...field, [key]: value } : field
    );
    setFormData(updatedFields);
  };

  const handleDeleteField = (index) => {
    const updatedFields = formData.filter((_, i) => i !== index);
    setFormData(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/getData?type=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName, formData }),
      });

      const response = await res.json();
      if (res.ok) {
        setSuccessMessage(response.message);
        setFormData([]);
        setTableName('');
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to create table');
    }
  };

  return (
    <div>
      <h1>CREATE NEW TABLE</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tableName">Table Name:</label>
          <input
            type="text"
            id="tableName"
            value={tableName}
            onChange={handleTableNameChange}
            placeholder="Enter table name"
          />
        </div>

        <h2>Fields</h2>
        {formData.map((field, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={field.nullable}
                onChange={(e) => handleFieldChange(index, 'nullable', e.target.checked)}
              />
              Nullable
            </label>
            <label>
              <input
                type="checkbox"
                checked={field.isPrimaryKey}
                onChange={(e) => handleFieldChange(index, 'isPrimaryKey', e.target.checked)}
              />
              Primary Key
            </label>
            <label>
              <input
                type="checkbox"
                checked={field.autoIncrement}
                onChange={(e) => handleFieldChange(index, 'autoIncrement', e.target.checked)}
              />
              Auto-Increment
            </label>
            <select
              value={field.dataType}
              onChange={(e) => handleFieldChange(index, 'dataType', e.target.value)}
            >
              <option value="Varchar(50)">Varchar(50)</option>
              <option value="Datetime">Datetime</option>
              <option value="Int">Int</option>
            </select>
            <button type="button" onClick={() => handleDeleteField(index)}>
              Delete
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddField}>
          Add Field
        </button>
        <button type="submit">Create Table</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}
