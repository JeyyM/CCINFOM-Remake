import React, { useState, useEffect } from 'react';

const TestForm = ({ onClose }) => {
    // INITIAL FORM DATA
    // ID IS ALWAYS SET, IT WILL BE IGNORED IN THE FIELD INPUTTING
    const [formData, setFormData] = useState([
        { name: 'ID', nullable: false, dataType: 'Int', isPrimaryKey: true, autoIncrement: true },
    { name: '', nullable: true, dataType: 'Varchar(50)', isPrimaryKey: false, autoIncrement: false },
    ]);

    // mandatory fields
    const [tableName, setTableName] = useState('');
    const [testPrice, setTestPrice] = useState('');

    const handleTableNameChange = (e) => {
        setTableName(e.target.value);
    };

    const handleTestPriceChange = (e) => {
        setTestPrice(e.target.value);
    };

    const validateTableName = () => {
        if (!tableName.trim()) {
            setError('Table name cannot be empty.');
            return false;
        }
        return true;
    };

    const validateTestPrice = () => {
        const price = parseFloat(testPrice);
        if (isNaN(price) || price <= 0) {
            setError2('Test price must be a valid positive number.');
            return false;
        }
        return true;
    };

    // TO FIELD MODIFICATION
    const handleAddField = (e) => {
        e.preventDefault();

        setFormData([
            ...formData,
            { name: '', nullable: true, dataType: 'Varchar(50)', isPrimaryKey: false, autoIncrement: false },
        ]);
    };

    const handleDeleteField = (index) => {
        const updatedFields = formData.filter((_, i) => i !== index);
        setFormData(updatedFields);
    };

    const handleChange = (index, key, value) => {
        const updatedFields = formData.map((fields, i) =>
            i === index ? { ...fields, [key]: value } : fields
        );
        setFormData(updatedFields);
    };

    // error and success messages
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successMessage2, setSuccessMessage2] = useState('');

    // to submit to the ref_test_type
    // WILL BE NESTED ON HANDLE SUBMIT
    const handleSubmitRef = async () => {
        setError2('');
        setSuccessMessage2('');

        const destination = "ref_test_type";

        const inputData = {
            test_name: tableName,
            test_price: testPrice
        };
    
        try {
          const res = await fetch('/api/getData?type=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableName: destination, formData: inputData })
          });
    
          const response = await res.json();
          if (res.ok) {
            setSuccessMessage2(response.message);
            // setTableName('');
            // setTestPrice('');
            onClose();
          } else {
            setError2(response.error);
          }
        } catch (err) {
          setError2('Failed to insert data');
        }
      };


    // FINAL COMPLETER
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        setError2('');
        setSuccessMessage2('');

        // INITIAL VALIDATIONS
        if (validateTableName() && validateTestPrice()){
            try {
                const res = await fetch('/api/getData?type=create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tableName, formData }),
                });
    
                const response = await res.json();
                if (res.ok) {
                    setSuccessMessage(response.message);
                    handleSubmitRef();
                } else {
                    setError(response.error);
                }
            } catch (err) {
                setError('Failed to create table');
            }
        }
    };
    
    return (
        <>
            <div className="popup-whitesheet" onClick={onClose}></div>
            <div className="test-form">
                <form className="pop-up-form" onSubmit={handleSubmit}>

                    <div className='form-row' style={{ justifyContent: "left" }}>
                        <h2 className="text-large-white-bold">TEST FORM</h2>
                        <button className='plus-button detail-text-dark' onClick={handleAddField}>+</button>
                    </div>

                    <div className="form-group">
                    <h3  className="text-medium-white-bold">Table Name:</h3>
                    <input
                        type="text"
                        value={tableName}
                        onChange={handleTableNameChange}
                        className='form-input detail-text-dark'
                        placeholder="Enter test name"
                    />
                    </div>

                    <div className="form-group">
                    <h3  className="text-medium-white-bold">Test Price:</h3>
                    <input
                        type="text"
                        value={testPrice}
                        onChange={handleTestPriceChange}
                        className='form-input detail-text-dark'
                        placeholder="Enter test name"
                    />
                    </div>

                    {formData.map((field, index) => {
                        if (index === 0) { return null }
                        else {
                            return <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: "center", justifyContent: "center" }}>
                                <div className="form-group">
                                    <label className="text-medium-white-bold">Field Name</label>
                                    <input
                                        className='form-input detail-text-dark'
                                        type="text"
                                        placeholder="Field Name"
                                        value={field.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        style={{ margin: "0" }}
                                    />
                                </div>
                                <select
                                    className='dropdown-item detail-text-dark'
                                    value={field.dataType}
                                    onChange={(e) => handleChange(index, 'dataType', e.target.value)}>
                                    <option value="Varchar(50)">Varchar(50)</option>
                                    <option value="Text">Text</option>
                                    <option value="Enum('M','F')">Enum('M','F')</option>
                                    <option value="Decimal(10,2)">Decimal(10,2)</option>
                                    <option value="Boolean">Boolean</option>
                                    <option value="Datetime">Datetime</option>
                                    <option value="Int">Int</option>
                                </select>
                                <button type="button" onClick={() => handleDeleteField(index)} className='plus-button detail-text-dark' style={{ width: "5rem", height: "4rem" }}>
                                    -
                                </button>
                            </div>
                        }
                    })}

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                    {error2 && <p style={{ color: 'red' }}>{error2}</p>}
                    {successMessage2 && <p style={{ color: 'green' }}>{successMessage2}</p>}
                    <div className="form-row">
                        <button type="button" className="large-button-outline detail-text-white" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="large-button-neon detail-text-dark">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default TestForm;
