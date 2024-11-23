import React, { useState } from 'react';

const TestItem = ({ matchingTest, columns, handleEdit, handleDelete }) => {
  const [formData, setFormData] = useState({ ...matchingTest });
  const [message, setMessage] = useState('');

  const handleChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      tableKey: 'ref_test_type',
      formData,
      primaryLabel: 'test_name',
      primaryInput: formData['test_name']
    };

    console.log('Payload being sent to handleEdit:', payload);

    try {
      await handleEdit(payload);
      setMessage('Successully Edited Entry');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };
  

  const handleItemDelete = async () => {
    setMessage('');
    const primaryKey = 'test_name';
    const primaryValue = formData[primaryKey];

    if (!primaryValue) {
      setMessage('Primary value is missing');
      return;
    }

    const result = window.confirm('Are you sure you want to proceed? This action cannot be undone.');
    if (!result) {
      console.log('User cancelled!');
      return;
    }

    try {
      await handleDelete({
        tableName: 'ref_test_type',
        primaryKey,
        primaryValue,
      });
      setMessage('Entry deleted successfully');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="test-item">
      <div className="set-name text-medium-dark-bold" style={{flexDirection:"column"}}>

      <span style={{width:"max-content", textAlign:"left", width:"100%", padding:"1rem"}}>{matchingTest.test_name}</span>
      <div style={{display:"flex", gap:"1rem"}}>
        {Object.entries(formData).filter(([key]) => key === 'test_price').map(([key, value]) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <input className='input-small' type="text" value={value} onChange={(e) => handleChange(e, key)} placeholder={`Enter value for ${key}`} style={{ marginLeft: '0.5rem' }}/>
          </div>
        ))}
        <button className="dark-button text-small-light" style={{ marginRight: '1rem' }} onClick={handleSubmit}>Save</button>
        <button className="dark-button text-small-light" style={{ backgroundColor: 'red', color: 'white' }} onClick={handleItemDelete}>Delete</button>
        </div>
      </div>

      <div className="test-fields">
        {columns.map((column, index) => (
          <h3 key={index} className="text-small-white">
            <span className="text-small-white-bold">{column.COLUMN_NAME}:</span> ({column.COLUMN_TYPE})
          </h3>
        ))}
      </div>

      {message && <p className="text-small-white">{message}</p>}
    </div>
  );
};

export default TestItem;
