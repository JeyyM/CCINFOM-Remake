import { useState } from 'react';

// USED IN THE SAMPLE
export default function ResultPopup({ selectedItem, tableName, primaryKey, onClose }) {
  if (!selectedItem) return null;

  // sets the form data to the current values so they are preset
  const [formData, setFormData] = useState({ ...selectedItem });
  const [message, setMessage] = useState('');

  console.log("Form Data", selectedItem);

  const handleChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    console.log(`Selected Item: ${JSON.stringify(selectedItem, null, 2)}`);
    console.log(`Table Name: ${tableName}`);
    console.log(`Primary Key: ${primaryKey}`);
    
    const primaryValue = selectedItem[primaryKey];
    if (!primaryValue) {
      setMessage('Primary value is missing');
      return;
    }

    // Uses PUT to edit
    try {
      const res = await fetch('/api/getData', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName,
          formData,
          primaryKey,
          primaryValue
        })
      });

      const response = await res.json();

      if (!res.ok) {
        setMessage(response.error);
      } else {
        setMessage(response.message);
        onClose();
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

    // Uses DELETE to remove the entry
    const handleDelete = async () => {
    setMessage('');

    const primaryValue = selectedItem[primaryKey];
    if (!primaryValue) {
      setMessage('Primary value is missing');
      return;
    }

    try {
      const res = await fetch('/api/getData', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName,
          primaryKey,
          primaryValue
        })
      });

      const response = await res.json();

      if (!res.ok) {
        setMessage(response.error);
      } else {
        setMessage('Entry deleted successfully');
        onClose();
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <div className='whitesheet' onClick={onClose}></div>
      <div className='result-popup'>
        <h2>Edit Entry</h2>

        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label>{key}:</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(e, key)}
                placeholder={`Enter value for ${key}`}
              />
            </div>
          ))}
          <button type="submit">Update</button>
        </form>
        
        {message && <p>{message}</p>}

        <button onClick={onClose}>Close</button>

        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
          Delete
        </button>
      </div>
    </>
  );
}
